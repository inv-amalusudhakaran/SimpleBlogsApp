import sys
import traceback

print("=" * 50)
print("BLOG ADMIN CREATION SCRIPT")
print("=" * 50)

try:
    print("\n[1/6] Importing modules...")
    from sqlalchemy.orm import Session
    from database import SessionLocal, engine
    import models
    import auth
    print("✓ Imports successful")

    print("\n[2/6] Creating database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("✓ Tables created")

    print("\n[3/6] Opening database connection...")
    db = SessionLocal()
    print("✓ Connection opened")

    print("\n[4/6] Checking for existing admin user...")
    existing_admin = db.query(models.User).filter(models.User.username == "admin").first()
    
    if existing_admin:
        print("⚠ Admin user already exists!")
        print(f"   Username: {existing_admin.username}")
        print(f"   Email: {existing_admin.email}")
        print(f"   Is Admin: {existing_admin.is_admin}")
        
        # Update to admin if not already
        if not existing_admin.is_admin:
            existing_admin.is_admin = True
            db.commit()
            print("✓ Updated user to admin status")
    else:
        print("✓ No existing admin found, creating new one...")
        
        # Create admin user
        hashed_password = auth.get_password_hash("admin123")
        admin_user = models.User(
            username="admin",
            email="admin@blog.com",
            hashed_password=hashed_password,
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print("✓ Admin user created successfully!")
        print("\n   Credentials:")
        print("   Username: admin")
        print("   Password: admin123")

    print("\n[5/6] Checking for existing regular user...")
    existing_user = db.query(models.User).filter(models.User.username == "user").first()
    
    if existing_user:
        print("⚠ Regular user already exists!")
        print(f"   Username: {existing_user.username}")
        print(f"   Email: {existing_user.email}")
    else:
        print("✓ No existing user found, creating new one...")
        
        # Create regular user
        regular_password = auth.get_password_hash("user123")
        regular_user = models.User(
            username="user",
            email="user@blog.com",
            hashed_password=regular_password,
            is_admin=False
        )
        db.add(regular_user)
        db.commit()
        print("✓ Regular user created successfully!")
        print("\n   Credentials:")
        print("   Username: user")
        print("   Password: user123")

    print("\n[6/6] Closing database connection...")
    db.close()
    print("✓ Connection closed")

    print("\n" + "=" * 50)
    print("SCRIPT COMPLETED SUCCESSFULLY!")
    print("=" * 50)
    print("\nYou can now:")
    print("1. Start the server: python main.py")
    print("2. Login with admin or user credentials")
    print("=" * 50)

except Exception as e:
    print("\n" + "=" * 50)
    print("❌ ERROR OCCURRED!")
    print("=" * 50)
    print(f"\nError message: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()
    print("\n" + "=" * 50)
    sys.exit(1)