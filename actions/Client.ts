"use server";

import { auth } from "@/auth";
import { User } from "@/models/index";
import checkPermission from "@/lib/checkPermission";
import dbConnect from "@/lib/mongodb";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { Client } from "@/models/index";

export async function createClient(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    await checkPermission(user?.role ?? "USER", "clients", "create");

    // Extract data from form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const district = formData.get("district") as string;
    const country = formData.get("country") as string;
    const region = formData.get("region") as string;
    const tin = formData.get("tin") as string;
    const vat = formData.get("vat") as string;
    const streetAddress = formData.get("streetAddress") as string;
    const phone = formData.get("phone") as string;

    const client = new Client({
      name,
      email,
      district,
      country,
      region,
      streetAddress,
      tin,
      vat,
      phone,
    });
    await client.save();
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Client has been saved" };
  } catch (error: any) {
    console.log(error.errorResponse);
    if (error.code === 11000) {
      return { success: false, message: "Email already exists" };
    }
    return { success: false, message: "Client creation failed" };
  }
}

export async function readClients() {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "clients", "read");

  // Fetch employee from database
  const employees = await Client.find({});
  return JSON.parse(JSON.stringify(employees));
}

export async function readClient(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "clients", "read");

  // Fetch employee from database
  const employee = await User.findById(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
}

export async function updateClient(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    await checkPermission(user?.role ?? "USER", "clients", "update");
    const data = {
      name: formData.get("name") as string,
      district: formData.get("district") as string,
      region: formData.get("region") as string,
      streetAddress: formData.get("streetAddress") as string,
      country: formData.get("country") as string,
      tin: formData.get("tin") as string,
      vat: formData.get("vat") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    // Update employee in database
    const client = await Client.findByIdAndUpdate(id, data, { new: true });
    if (!client) throw new Error("Client not found");
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Client has benn updated successfully" };
  } catch (error) {
    console.log({ error });
    return { success: false, message: "Client update failed" };
  }
}

export async function deleteClient(id: string) {
  try {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    await checkPermission(user?.role ?? "USER", "clients", "delete");

    // Delete employee from database
    const result = await Client.findByIdAndDelete(id);
    if (!result) throw new Error("Client not found");
    revalidatePath("/dashboard/clients");
    return { message: "Client deleted successfully" };
  } catch (error) {
    console.log(error);
    return { message: "Client deletion failed" };
  }
}
