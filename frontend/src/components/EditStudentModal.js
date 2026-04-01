import { useEffect, useState } from "react";
import API from "../apiConfig/api";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

function EditStudentModal({ student, refresh }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    subject: "",
    marks: ""
  });

  const [loading, setLoading] = useState(false);

  // Populate form when student changes
  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        email: student.email || "",
        age: student.age || "",
        subject: student.marks?.[0]?.subject || "",
        marks: student.marks?.[0]?.marks || ""
      });
    }
  }, [student]);

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

  // Close modal safely
  const closeModal = () => {
    const modalEl = document.getElementById("editModal");
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

  // Handle update
  const handleUpdate = async () => {
    if (!student) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { name, email, age, subject, marks } = form;

      // Update student
      await API.put(`/students/${student.id}`, {
        name,
        email,
        age: Number(age)
      });

      // Update or create marks
      if (student.marks?.length > 0) {
        await API.put(`/students/marks/${student.marks[0].id}`, {
          subject,
          marks: Number(marks)
        });
      } else {
        await API.post(`/students/${student.id}/marks`, {
          subject,
          marks: Number(marks)
        });
      }

      Swal.fire("Success", "Student updated successfully", "success");

      refresh(); // refresh table
      closeModal();
      resetForm();

    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        err.response?.data?.error || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="editModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5>Edit Student</h5>
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
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
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

export default EditStudentModal;