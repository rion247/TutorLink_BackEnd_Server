import mongoose, { Schema } from 'mongoose';
import { SubjectModel, TSubject } from './subject.interface';
import { gradeLevelArray } from './subject.constant';

const subjectSchema = new Schema<TSubject, SubjectModel>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required!!!'],
    },
    category: {
      type: String,
      required: [true, 'Subject category is required!!!'],
    },
    gradeLevel: {
      type: String,
      enum: { values: gradeLevelArray, message: '{VALUE} is not supported!!!' },
      required: [true, 'Grade Level is required!!!'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// subjectSchema.pre('find', function () {
//   this.find({ isActive: { $ne: false } });
// });

// subjectSchema.pre('findOne', function () {
//   this.findOne({ isActive: { $ne: false } });
// });

subjectSchema.statics.isSubjectExist = async function (id: string) {
  const subjectInformation = await Subject.findById(id);

  return subjectInformation;
};

export const Subject = mongoose.model<TSubject, SubjectModel>(
  'Subject',
  subjectSchema,
);
