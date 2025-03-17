"use client";
import React, { useState } from "react";
import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import createRoles from "@/actions/createRoles";
import { Input } from "./ui/input";
import { set } from "mongoose";

type PermissionActions = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

type Permissions = {
  bils: PermissionActions;
  users: PermissionActions;
  transactions: PermissionActions;
  invoices: PermissionActions;
  clients: PermissionActions;
  reports: PermissionActions;
  roles: PermissionActions;
};

export default function RoleForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({
    bils: { create: true, read: true, update: true, delete: false },
    users: { create: true, read: true, update: true, delete: false },
    transactions: { create: true, read: true, update: true, delete: false },
    roles: { create: true, read: true, update: true, delete: false },
    clients: { create: true, read: true, update: true, delete: false },
    reports: { create: true, read: true, update: true, delete: false },
    invoices: { create: true, read: true, update: true, delete: false },
  });

  const handleCheckboxChange = (
    resource: keyof Permissions,
    action: keyof PermissionActions
  ) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [resource]: {
        ...prevPermissions[resource],
        [action]: !prevPermissions[resource][action],
      },
    }));
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const role = {
      name,
      permissions,
    };
    setIsLoading(true);
    await createRoles(role);
    setOpen(false);
    try {
    } catch (error) {
      console.error("Error during role creation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#f38633] hover:bg-[#d4915e] text-white rounded-md">
          Create New Role
        </Button>
      </DialogTrigger>

      <DialogContent className="p-4 bg-white text-black rounded-lg">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <Wrapper>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormControl>
              <label htmlFor="name">Role Name</label>
              <Input
                name="name"
                value={name}
                required
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-6"
              />
            </FormControl>
            <span>Role Permissions</span>
            <Table className="w-full">
              <thead>
                <TableHeaderRow>
                  <TableHeaderCell>Resource</TableHeaderCell>
                  <TableHeaderCell>Create</TableHeaderCell>
                  <TableHeaderCell>Read</TableHeaderCell>
                  <TableHeaderCell>Update</TableHeaderCell>
                  <TableHeaderCell>Delete</TableHeaderCell>
                </TableHeaderRow>
              </thead>
              <tbody>
                {Object.keys(permissions).map((resource) => (
                  <tr key={resource}>
                    <td>{resource}</td>
                    {["create", "read", "update", "delete"].map((action) => (
                      <td key={action}>
                        <input
                          type="checkbox"
                          checked={
                            permissions[resource as keyof Permissions][
                              action as keyof PermissionActions
                            ]
                          }
                          onChange={() =>
                            handleCheckboxChange(
                              resource as keyof Permissions,
                              action as keyof PermissionActions
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              type="submit"
              className="bg-[#f38633] hover:bg-[#d4915e] text-white rounded-md"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </form>
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
}

const Wrapper = styled.div``;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
`;

const Table = styled.table``;
const TableHeaderRow = styled.tr``;
const TableHeaderCell = styled.th`
  text-align: left;
`;
