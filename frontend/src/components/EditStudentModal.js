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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const { name, email, age, subject, marks } = form;

      if (!name || !email || !age || !subject || !marks) {
        return Swal.fire("Error", "All fields are required", "error");
      }

      // ✅ Update student
      await API.put(`/students/${student.id}`, { name, email, age });

      // ✅ Update or create marks
      if (student.marks && student.marks.length > 0) {
        await API.put(`/students/marks/${student.marks[0].id}`, {
          subject,
          marks
        });
      } else {
        await API.post(`/students/${student.id}/marks`, {
          subject,
          marks
        });
      }

      Swal.fire("Success", "Student updated successfully", "success");

      refresh();

      // ✅ Close modal safely
      const modalEl = document.getElementById("editModal");
      const modal = Modal.getOrCreateInstance(modalEl);
      modal.hide();

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Update failed",
        "error"
      );
    }
  };

  return (
    <div className="modal fade" id="editModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5>Edit Student</h5>
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
            <button className="btn btn-success" onClick={handleUpdate}>
              Update
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

export default EditStudentModal;