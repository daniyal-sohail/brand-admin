import { Geist, Geist_Mono } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

import RouterGuard from "@/components/router/router";
import { DashboardProvider } from "@/context/DashboardContext";
import { UserProvider } from "@/context/UserContext";
import { CanvaProvider } from "@/context/CanvaContext";
import { FAQProvider } from "@/context/FAQContext";
import { AdminTemplateProvider } from "@/context/AdminTemplateContext";
import { PlanProvider } from "@/context/PlanContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard - Brand Management System",
  description: "Comprehensive admin dashboard for managing brands, templates, users, and content",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <DashboardProvider>
            <UserProvider>
              <CanvaProvider>
                <FAQProvider>
                  <AdminTemplateProvider>
                    <PlanProvider>
                      <RouterGuard>{children}</RouterGuard>
                      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                      />
                    </PlanProvider>
                  </AdminTemplateProvider>
                </FAQProvider>
              </CanvaProvider>
            </UserProvider>
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
