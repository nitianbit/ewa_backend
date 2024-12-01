const ReviewSchema = new mongoose.Schema(
    {
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
      },
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Assuming a Patient schema exists
      },
      rating: { type: Number, required: true, min: 1, max: 5 },
      reviewText: { type: String },
      createdAt: { type: Date, default: Date.now },
    }
  );
  
 const Review = mongoose.model('Review', ReviewSchema);
 export default Review
  