import { Routes } from "@angular/router";
import { authGuard, loginGuard } from "./core/guards/auth.guard";
import { roleGuard } from "./core/guards/role.guard";
import { UserRole } from "./core/models/user.model";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login.component").then((c) => c.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (c) => c.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "tasks",
    loadComponent: () =>
      import("./features/tasks/task-list.component").then(
        (c) => c.TaskListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./features/admin/admin-panel.component").then(
        (c) => c.AdminPanelComponent
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] },
  },
  {
    path: "teacher",
    loadComponent: () =>
      import("./features/teacher/teacher-panel.component").then(
        (c) => c.TeacherPanelComponent
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.TEACHER, UserRole.ADMIN] },
  },
  {
    path: "student",
    loadComponent: () =>
      import("./features/student/student-panel.component").then(
        (c) => c.StudentPanelComponent
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.STUDENT] },
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];