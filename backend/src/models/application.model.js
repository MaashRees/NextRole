const mongoose = require("mongoose");


const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: {
    type: String,
    enum: ['En attente', 'Relancé', 'Entretien', 'Refusé', 'Accepté'],
    default: 'En attente'
  },
  appliedDate: { 
    type: Date, 
    default: Date.now 
  },
  followUps: {
    dates: [
        { 
            type: Date 
        }
    ],
    notes: { 
        type: String, 
        trim: true 
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

applicationSchema.virtual('followUpCount').get(function() {
  return this.followUps.dates.length;
});