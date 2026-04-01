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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const { name, email, age, subject, marks } = form;

      if (!name || !email || !age || !subject || !marks) {
        return Swal.fire("Error", "All fields are required", "error");
      }

      // Create student
      const studentRes = await API.post("/students", { name, email, age });

      // Add marks
      await API.post(`/students/${studentRes.data.id}/marks`, {
        subject,
        marks
      });

      Swal.fire("Success", "Student added successfully", "success");

      fetchStudents();

      // Close modal
      const modalEl = document.getElementById("studentModal");
      const modal = Modal.getOrCreateInstance(modalEl);
      modal.hide();

      // Reset form
      setForm({
        name: "",
        email: "",
        age: "",
        subject: "",
        marks: ""
      });

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="modal fade" id="studentModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5>Add New Member</h5>
            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <input name="name" value={form.name} onChange={handleChange}
              className="form-control mb-2" placeholder="Name" />

            <input name="email" value={form.email} onChange={handleChange}
              className="form-control mb-2" placeholder="Email" />

            <input name="age" type="number" value={form.age} onChange={handleChange}
              className="form-control mb-2" placeholder="Age" />

            <input name="subject" value={form.subject} onChange={handleChange}
              className="form-control mb-2" placeholder="Subject" />

            <input name="marks" type="number" value={form.marks} onChange={handleChange}
              className="form-control mb-2" placeholder="Marks" />
          </div>

          <div className="modal-footer">
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentModal;