from database import SessionLocal
import models

# Open session
db = SessionLocal()

# Delete users with id 3 and 4
db.query(models.User).filter(models.User.id.in_([3, 4])).delete(synchronize_session=False)
db.commit()

# Close session
db.close()

print("Users deleted successfully!")
