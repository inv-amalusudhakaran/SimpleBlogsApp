from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

password = "admin123"
print(f"Password: {password}")
print(f"Password length: {len(password)}")
print(f"Password bytes: {len(password.encode('utf-8'))}")

try:
    hashed = pwd_context.hash(password)
    print(f"Success! Hash: {hashed[:20]}...")
except Exception as e:
    print(f"Error: {e}")