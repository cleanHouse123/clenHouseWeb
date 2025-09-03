import React from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminNavBar } from "./AdminNavBar";

export const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-background">
            <AdminHeader />
            <div className="flex pt-16">
                <AdminNavBar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
