from sqlalchemy.orm import Session
from app.models.user import User
from app.models.friendship import Friendship
from app.schemas.user import UserUpdate

async def update_user(db: Session, user_id: int, user_update: UserUpdate):
    """Actualizar información del usuario"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

async def send_friend_request(db: Session, user_id: int, friend_id: int):
    """Enviar solicitud de amistad"""
    # Verificar que no sea el mismo usuario
    if user_id == friend_id:
        return {"error": "No puedes agregarte a ti mismo"}
    
    # Verificar que el usuario objetivo existe
    friend = db.query(User).filter(User.id == friend_id).first()
    if not friend:
        return {"error": "Usuario no encontrado"}
    
    # Verificar que no existe ya una amistad
    existing_friendship = db.query(Friendship).filter(
        ((Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)) |
        ((Friendship.user_id == friend_id) & (Friendship.friend_id == user_id))
    ).first()
    
    if existing_friendship:
        return {"error": "Ya existe una solicitud de amistad"}
    
    # Crear nueva solicitud
    friendship = Friendship(user_id=user_id, friend_id=friend_id)
    db.add(friendship)
    db.commit()
    
    return {"message": "Solicitud de amistad enviada"}

async def get_friends(db: Session, user_id: int):
    """Obtener lista de amigos del usuario"""
    friendships = db.query(Friendship).filter(
        ((Friendship.user_id == user_id) | (Friendship.friend_id == user_id)) &
        (Friendship.is_accepted == True)
    ).all()
    
    friend_ids = []
    for friendship in friendships:
        if friendship.user_id == user_id:
            friend_ids.append(friendship.friend_id)
        else:
            friend_ids.append(friendship.user_id)
    
    friends = db.query(User).filter(User.id.in_(friend_ids)).all()
    return friends
