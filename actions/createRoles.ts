"use server";

import { Role } from "@/models/index";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export default async function createRoles(role: any) {
  await dbConnect();
  try {
    const roleRes = new Role({
      name: role.name,
      permissions: role.permissions,
    });
    await roleRes.save();
    revalidatePath("/dashboard/roles");
    return { success: true, message: "Role has been saved" };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: "Role creation failed" };
  }
}
