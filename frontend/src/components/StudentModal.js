import { useState } from "react";
import API from "../apiConfig/api";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

function StudentModal({ fetchStudents }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    subject: "",
    marks: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const { name, email, age, subject, marks } = form;

    if (!name || !email || !age || !subject || !marks) {
      Swal.fire("Error", "All fields are required", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire("Error", "Invalid email format", "error");
      return false;
    }

    if (age <= 0) {
      Swal.fire("Error", "Age must be greater than 0", "error");
      return false;
    }

    if (marks < 0) {
      Swal.fire("Error", "Marks cannot be negative", "error");
      return false;
    }

    return true;
  };

  // Close modal
  const closeModal = () => {
    const modalEl = document.getElementById("studentModal");
    const modal = Modal.getOrCreateInstance(modalEl);
    modal.hide();
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      age: "",
      subject: "",
      marks: ""
    });
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const { name, email, age, subject, marks } = form;

      // Create student
      const studentRes = await API.post("/students", {
        name,
        email,
        age: Number(age)
      });

      // Add marks
      await API.post(`/students/${studentRes.data.id}/marks`, {
        subject,
        marks: Number(marks)
      });

      Swal.fire("Success", "Student added successfully", "success");

      fetchStudents(); // trigger refresh
      closeModal();
      resetForm();

    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        err.response?.data?.error || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="studentModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5>Add New Member</h5>
            <button
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Name"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Email"
            />

            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Age"
            />

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Subject"
            />

            <input
              name="marks"
              type="number"
              value={form.marks}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Marks"
            />

          </div>

          <div className="modal-footer">
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={resetForm}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentModal;