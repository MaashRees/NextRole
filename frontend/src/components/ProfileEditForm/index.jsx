

const ProfileEditForm = ({ formData, setFormData, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="profile-form">
      <div>
        <label><strong>Email :</strong></label>
        <input 
          placeholder="Votre mail"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
      </div>

      <div>
        <label><strong>Prénom :</strong></label>
        <input 
          placeholder="Votre prénom"
          value={formData.firstname} 
          onChange={(e) => setFormData({...formData, firstname: e.target.value})} 
        />
      </div>
      
      <div>
        <label><strong>Nom :</strong></label>
        <input 
          placeholder="Votre nom"
          value={formData.lastname} 
          onChange={(e) => setFormData({...formData, lastname: e.target.value})} 
        />
      </div>
      
      <div>
        <label><strong>Âge :</strong></label>
        <input 
          type="number"
          placeholder="Votre âge"
          value={formData.age} 
          onChange={(e) => setFormData({...formData, age: e.target.value})} 
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Enregistrer les modifications
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;