from database import get_session, create_db
from models import User
from routers.auth import get_password_hash
import secrets
import string

def test_registration():
    create_db()
    session_gen = get_session()
    session = next(session_gen)
    
    email = f"test_{secrets.token_hex(4)}@example.com"
    print(f"Testing with email: {email}")
    
    try:
        new_user = User(
            email=email,
            password_hash=get_password_hash("password123"),
            is_verified=False,
            verification_code="123456",
            parent_phone="9998887776",
            theme="dark",
            notif_quiz=True,
            notif_docs=True
        )
        session.add(new_user)
        session.commit()
        print("Success!")
    except Exception as e:
        print(f"Error during registration: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    test_registration()
