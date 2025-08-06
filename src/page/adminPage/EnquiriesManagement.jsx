import React, { useState } from "react";
import { Mail, Phone, FileText } from "lucide-react";

const EnquiriesManagement = () => {
  const [enquiries] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      message: "Interested in the Kerala package",
      related: "Kerala to Malaysia - 4D/3N",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 9123456789",
      message: "Need more info on honeymoon packages",
      related: "Manali Winter Tour",
    },
    {
      name: "Amit Sharma",
      email: "amit@example.com",
      phone: "+91 9988776655",
      message: "Is the Dubai package available in December?",
      related: "Dubai Deluxe Trip",
    },
  ]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 p-6">
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-7 h-7 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Enquiries Management</h1>
        </div>
        <p className="text-gray-500 text-sm">
          View and manage all customer enquiries submitted through the platform.
        </p>
      </div>

      {/* Scrollable Enquiries Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
            <thead className="bg-blue-100 text-gray-700 text-left text-sm uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Related Package</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-4 py-3 font-medium text-gray-900">{enquiry.name}</td>
                  <td className="px-4 py-3 text-blue-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-800">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {enquiry.phone}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{enquiry.message}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-700">
                    {enquiry.related}
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesManagement;
