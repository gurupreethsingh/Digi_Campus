// components/common_components/MainLayout.jsx
import React from "react";
import Header from "../header_components/Header";
import Footer from "../footer_components/Footer";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "../auth_components/AuthManager";
import PageTitle from "./PageTitle";

// Pages (imported)
import Homepage from "../../pages/common_pages/Homepage";
import PageNotFound from "../../pages/common_pages/PageNotFound";
import AboutUs from "../../pages/common_pages/AboutUs";
import ContactUs from "../../pages/contact_pages/ContactUs";
import AllMessages from "../../pages/contact_pages/AllMessages";
import ReplyMessage from "../../pages/contact_pages/ReplyMessage";
import AllReplies from "../../pages/contact_pages/AllReplies";
import AllBlogs from "../../pages/blog_pages/AllBlogs";
import SingleBlog from "../../pages/blog_pages/SingleBlog";
import AddBlog from "../../pages/blog_pages/AddBlog";
import SuperAdminLogin from "../../pages/superadmin_pages/SuperAdminLogin";
import Register from "../../pages/user_pages/Register";
import ForgotPassword from "../../pages/user_pages/ForgotPassword";
import ResetPassword from "../../pages/user_pages/ResetPassword";
import SuperAdminDashboard from "../../pages/superadmin_pages/SuperAdminDashboard";
import AllUsers from "../../pages/superadmin_pages/AllUsers";
import SingleUser from "../../pages/superadmin_pages/SingleUser";
import Profile from "../../pages/user_pages/Profile";
import UpdateProfile from "../../pages/user_pages/UpdateProfile";
// teacher pages
import TeacherLogin from "../../pages/teacher_pages/TeacherLogin";
import TeacherDashboard from "../../pages/teacher_pages/TeacherDashboard";
// subject pages.
import AddSubject from "../../pages/subject_pages/AddSubject";
import AllSubjects from "../../pages/subject_pages/AllSubjects";
import SingleSubject from "../../pages/subject_pages/SingleSubject";
import UpdateSubject from "../../pages/subject_pages/UpdateSubject";

// subject pages.
import AddTopic from "../../pages/topic_pages/AddTopic";
import AllTopics from "../../pages/topic_pages/AllTopics";
import SingleTopic from "../../pages/topic_pages/SingleTopic";
import UpdateTopic from "../../pages/topic_pages/UpdateTopic";
import AddQuiz from "../../pages/quiz_pages/AddQuiz";
import AllQuizzes from "../../pages/quiz_pages/AllQuizzes";
import SingleQuiz from "../../pages/quiz_pages/SingleQuiz";
import UpdateQuiz from "../../pages/quiz_pages/UpdateQuiz";

// student pages.
import StudentLogin from "../../pages/student_pages/StudentLogin";
import StudentDashboard from "../../pages/student_pages/StudentDashboard";

const MainLayout = () => {
  return (
    <div className="min-h-screen text-gray-900">
      <Header />
      <main className="flex-grow containerWidth py-6">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PageTitle title="Home">
                <Homepage />
              </PageTitle>
            }
          />
          <Route
            path="/home"
            element={
              <PageTitle title="Home">
                <Homepage />
              </PageTitle>
            }
          />
          <Route
            path="/about-us"
            element={
              <PageTitle title="About Us">
                <AboutUs />
              </PageTitle>
            }
          />
          <Route
            path="/contact-us"
            element={
              <PageTitle title="Contact Us">
                <ContactUs />
              </PageTitle>
            }
          />
          <Route
            path="/all-blogs"
            element={
              <PageTitle title="Blogs">
                <AllBlogs />
              </PageTitle>
            }
          />
          <Route
            path="/single-blog/:id"
            element={
              <PageTitle title="Single Blog">
                <SingleBlog />
              </PageTitle>
            }
          />
          <Route
            path="/superadmin-login"
            element={
              <PublicRoute>
                <PageTitle title="Superadmin Login">
                  <SuperAdminLogin />
                </PageTitle>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute allowedRoles={["superadmin"]}>
                <PageTitle title="Register">
                  <Register />
                </PageTitle>
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Private Superadmin Routes */}
          <Route
            path="/superadmin-dashboard"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <PageTitle title="Superadmin Dashboard">
                  <SuperAdminDashboard />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/add-blog"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <PageTitle title="Add Blog">
                  <AddBlog />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/all-users"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <PageTitle title="All Users">
                  <AllUsers />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/single-user/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <PageTitle title="Single User">
                  <SingleUser />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/all-messages"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <PageTitle title="All Messages">
                  <AllMessages />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/reply-message/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <PageTitle title="Reply Message">
                  <ReplyMessage />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/all-replies"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <PageTitle title="All Replies">
                  <AllReplies />
                </PageTitle>
              </PrivateRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Profile">
                  <Profile />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/update-profile/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Update Profile">
                  <UpdateProfile />
                </PageTitle>
              </PrivateRoute>
            }
          />

          {/* teacher pages.  */}
          <Route
            path="/teacher-login"
            element={
              <PublicRoute>
                <PageTitle title="Teacher Login">
                  <TeacherLogin />
                </PageTitle>
              </PublicRoute>
            }
          />

          <Route
            path="/teacher-dashboard"
            element={
              <PrivateRoute allowedRoles={["superadmin", "teacher"]}>
                <PageTitle title="Teacher Dashboard">
                  <TeacherDashboard />
                </PageTitle>
              </PrivateRoute>
            }
          />

          {/* add subject  */}
          <Route
            path="/add-subject"
            element={
              <PrivateRoute allowedRoles={["superadmin", "teacher"]}>
                <PageTitle title="Add Subject">
                  <AddSubject />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/all-subjects"
            element={
              <PrivateRoute allowedRoles={["superadmin", "teacher"]}>
                <PageTitle title="All Subjects">
                  <AllSubjects />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/single-subject/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Single Subject">
                  <SingleSubject />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/update-subject/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Update subject">
                  <UpdateSubject />
                </PageTitle>
              </PrivateRoute>
            }
          />

          {/* add topic  */}
          <Route
            path="/add-topic"
            element={
              <PrivateRoute allowedRoles={["superadmin", "teacher"]}>
                <PageTitle title="Add topic">
                  <AddTopic />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/all-topics"
            element={
              <PrivateRoute allowedRoles={["superadmin", "teacher"]}>
                <PageTitle title="All topics">
                  <AllTopics />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/single-topic/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Single topic">
                  <SingleTopic />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/update-topic/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Update topic">
                  <UpdateTopic />
                </PageTitle>
              </PrivateRoute>
            }
          />

          {/* add quiz  */}
          <Route
            path="/add-quiz"
            element={
              <PrivateRoute allowedRoles={["superadmin", "teacher"]}>
                <PageTitle title="Add quiz">
                  <AddQuiz />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/all-quizzes"
            element={
              <PrivateRoute allowedRoles={["superadmin", "teacher"]}>
                <PageTitle title="All quizs">
                  <AllQuizzes />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/single-quiz/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Single quiz">
                  <SingleQuiz />
                </PageTitle>
              </PrivateRoute>
            }
          />

          <Route
            path="/update-quiz/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Update quiz">
                  <UpdateQuiz />
                </PageTitle>
              </PrivateRoute>
            }
          />

          {/* student pages..  */}
          <Route
            path="/student-login"
            element={
              <PublicRoute>
                <PageTitle title="Student Login">
                  <StudentLogin />
                </PageTitle>
              </PublicRoute>
            }
          />

          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute allowedRoles={["superadmin", "student"]}>
                <PageTitle title="Student Dashboard">
                  <StudentDashboard />
                </PageTitle>
              </PrivateRoute>
            }
          />

          {/* 404 Page */}
          <Route
            path="/page-not-found"
            element={
              <PageTitle title="404 Not Found">
                <PageNotFound />
              </PageTitle>
            }
          />
          <Route
            path="*"
            element={
              <PageTitle title="404 Not Found">
                <PageNotFound />
              </PageTitle>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
