

from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

import models
import schemas
import auth
from database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# AUTHENTICATION
# =====================================================

@app.post(
    "/api/register",
    response_model=schemas.User,
    status_code=status.HTTP_201_CREATED
)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check username
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check email
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = auth.get_password_hash(user.password)

    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=False
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post(
    "/api/login",
    response_model=schemas.Token,
    status_code=status.HTTP_200_OK
)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(
        db,
        user_credentials.username,
        user_credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = auth.create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get(
    "/api/users/me",
    response_model=schemas.User,
    status_code=status.HTTP_200_OK
)
def read_users_me(
    current_user: models.User = Depends(auth.get_current_user)
):
    return current_user


# =====================================================
# ADMIN
# =====================================================

@app.get(
    "/api/admin/users",
    response_model=List[schemas.User],
    status_code=status.HTTP_200_OK
)
def get_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    return db.query(models.User).all()


# =====================================================
# BLOG POSTS
# =====================================================

@app.get(
    "/api/posts",
    response_model=List[schemas.BlogPost],
    status_code=status.HTTP_200_OK
)
def get_posts(search: str = "", db: Session = Depends(get_db)):
    query = db.query(models.BlogPost)

    if search:
        query = query.filter(
            (models.BlogPost.title.contains(search)) |
            (models.BlogPost.content.contains(search))
        )

    posts = query.order_by(models.BlogPost.created_at.desc()).all()

    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "author_id": post.author_id,
            "author_username": post.author.username,
            "created_at": post.created_at,
            "updated_at": post.updated_at
        })

    return result


@app.get(
    "/api/posts/{post_id}",
    response_model=schemas.BlogPost,
    status_code=status.HTTP_200_OK
)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "author_id": post.author_id,
        "author_username": post.author.username,
        "created_at": post.created_at,
        "updated_at": post.updated_at
    }


@app.post(
    "/api/posts",
    response_model=schemas.BlogPost,
    status_code=status.HTTP_201_CREATED
)
def create_post(
    post: schemas.BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    db_post = models.BlogPost(
        **post.dict(),
        author_id=current_user.id
    )

    db.add(db_post)
    db.commit()
    db.refresh(db_post)

    return {
        "id": db_post.id,
        "title": db_post.title,
        "content": db_post.content,
        "author_id": db_post.author_id,
        "author_username": db_post.author.username,
        "created_at": db_post.created_at,
        "updated_at": db_post.updated_at
    }


@app.put(
    "/api/posts/{post_id}",
    response_model=schemas.BlogPost,
    status_code=status.HTTP_200_OK
)
def update_post(
    post_id: int,
    post_update: schemas.BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    db_post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()

    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    update_data = post_update.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_post, field, value)

    db.commit()
    db.refresh(db_post)

    return {
        "id": db_post.id,
        "title": db_post.title,
        "content": db_post.content,
        "author_id": db_post.author_id,
        "author_username": db_post.author.username,
        "created_at": db_post.created_at,
        "updated_at": db_post.updated_at
    }


@app.delete(
    "/api/posts/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    db_post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()

    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    db.delete(db_post)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
