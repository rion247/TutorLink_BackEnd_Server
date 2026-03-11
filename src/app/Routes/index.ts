import express from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { SubjectRoutes } from './../modules/Subject/subject.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { OfferedSubjectRoutes } from '../modules/OfferedSubject/offeredSubject.routes';
import { BookingRoutes } from '../modules/Booking/booking.routes';
import { ReviewRoutes } from '../modules/Review/review.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { StudentRoutes } from '../modules/Student/student.routes';
import { TutorRoutes } from '../modules/Tutor/tutor.routes';
const router = express.Router();

const modelRoutes = [
  { pathName: '/users', route: UserRoutes },
  { pathName: '/subjects', route: SubjectRoutes },
  { pathName: '/auth', route: AuthRoutes },
  { pathName: '/offered-subjects', route: OfferedSubjectRoutes },
  { pathName: '/bookings', route: BookingRoutes },
  { pathName: '/reviews', route: ReviewRoutes },
  { pathName: '/admin', route: AdminRoutes },
  { pathName: '/students', route: StudentRoutes },
  { pathName: '/tutors', route: TutorRoutes },
];

modelRoutes.forEach((item) => router.use(item.pathName, item.route));

export default router;
