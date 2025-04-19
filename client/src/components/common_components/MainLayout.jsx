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
import AllBlogs from "../../pages/blog_pages/AllBlogs";
import SingleBlog from "../../pages/blog_pages/SingleBlog";
import AddBlog from "../../pages/blog_pages/AddBlog";
import Login from "../../pages/user_pages/Login";
import Register from "../../pages/user_pages/Register";
import ForgotPassword from "../../pages/user_pages/ForgotPassword";
import ResetPassword from "../../pages/user_pages/ResetPassword";
import SuperAdminDashboard from "../../pages/superadmin_pages/SuperAdminDashboard";
import AllUsers from "../../pages/superadmin_pages/AllUsers";
import SingleUser from "../../pages/superadmin_pages/SingleUser";
import Profile from "../../pages/user_pages/Profile";
import UpdateProfile from "../../pages/user_pages/UpdateProfile";
import AllMessages from "../../pages/contact_pages/AllMessages";
import ReplyMessage from "../../pages/contact_pages/ReplyMessage";
import AllReplies from "../../pages/contact_pages/AllReplies";

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
            path="/login"
            element={
              <PublicRoute>
                <PageTitle title="Login">
                  <Login />
                </PageTitle>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
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
