"use client";

import { use, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, Users } from "lucide-react";
import { set } from "date-fns";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    matricNumber: "STU12345",
    joinDate: "2023-09-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Student",
    matricNumber: "STU12346",
    joinDate: "2023-09-16",
  },
  {
    id: 3,
    name: "Dr. Johnson",
    email: "dr.johnson@example.com",
    role: "Admin",
    matricNumber: null,
    joinDate: "2023-08-01",
  },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<
    {
      _id: string;
      family_name: string;
      given_name: string;
      email: string;
      role: string;
      matric_number: string | null;
      createdAt: string;
    }[]
  >([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const { toast } = useToast();

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.given_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.matric_number &&
          user.matric_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  useEffect(() => {
    const fetchAndSetUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    fetchAndSetUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleEdit = (userId: string) => {
    toast({
      title: "Info",
      description: "Edit user functionality would be implemented here",
    });
  };

  const handleDelete = (userId: string) => {
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  const handleSearchUser = () => {
    toast({
      title: "Search",
      description:
        "Advanced user search functionality would be implemented here",
    });
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-purple-600">
              User Management
            </h1>
            <p className="text-gray-600">Manage students and admin users</p>
          </div>

          {/* Search and Search User */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">
                            {user.given_name.charAt(0)}
                            {user.family_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {user.given_name} {user.family_name}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                            {user.matric_number && (
                              <span className="text-xs text-gray-500">
                                Matric: {user.matric_number}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              Joined: {user.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(user._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div> */}
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
