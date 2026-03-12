const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstname: { 
    type: String, 
    trim: true 
  },
  lastname: { 
    type: String, 
    trim: true 
  },
  position: { 
    type: String, 
    trim: true 
  },
  phone: { 
    type: String, 
    match: /^\+\d{1,3}\d{9,10}$/
  },
  email: { 
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  linkedin: { 
    type: String, 
    trim: true,
    match: /^(https:\/\/www\.linkedin\.com\/in\/)?[\w-]+\/?$/
  }
}, 
{ _id: false }
);

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  company: { 
    type: String, 
    required: true, 
    trim: true 
  },
  location: { 
    type: String, 
    required: true,
    trim: true 
  },
  salary: {
    mini: { 
        type: Number, 
        default: 0 
    },
    maxi: { 
        type: Number, 
        default: 0 
    },
    currency: { 
        type: String, 
        default: 'EUR', 
        uppercase: true,
        trim: true 
    }
  },
  publishedDate: { 
    type: Date, 
    default: Date.now 
  },
  link: { 
    type: String, 
    trim: true,
    match: /^https?:\/\// 
  },
  skillsRequired: [
    { 
        type: String, 
        trim: true 
    }
  ],
  tags: [
    { 
        type: String, 
        trim: true 
    }
  ],
  educationRequired: { 
    type: String, 
    trim: true 
  },
  seniority: { 
    type: Number,
    default: -1
  },
  workRhythm: { 
    type: String, 
    enum: ['Présentiel', 'Hybride', 'Télétravail total'],
    default: 'Présentiel'
  },
  contractType: { 
    type: String, 
    enum: ['CDI', 'CDD', 'Alternance', 'Stage', 'Freelance'],
    required: true
  },
  applicationSource: { 
    type: String, 
    trim: true 
  },
  author: contactSchema, 
  contacts: [
    contactSchema
  ], 
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, 
{ 
    timestamps: true 
});

module.exports = mongoose.model("Job", jobSchema);