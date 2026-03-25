
const ProfileDetails = ({ user, onEditClick }) => {
  return (
    <div className="profile-details">
      <p><strong>Prénom :</strong> {user?.firstname}</p>
      <p><strong>Nom :</strong> {user?.lastname}</p>
      <p><strong>Email :</strong> {user?.email}</p>
      <p><strong>Âge :</strong> {user?.age} ans</p>
      
      <button 
        onClick={onEditClick} 
        style={{ marginTop: '15px' }}
      >
        Éditer mon profil
      </button>
    </div>
  );
};

export default ProfileDetails;