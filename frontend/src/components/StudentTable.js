import { useEffect, useState } from "react";
import API from "../apiConfig/api";
import Swal from "sweetalert2";
import EditStudentModal from "./EditStudentModal";

function StudentTable({ refresh }) {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const limit = 5;

  const fetchStudents = async () => {
    try {
      const res = await API.get(
        `/students?page=${page}&limit=${limit}&t=${Date.now()}`
      );
      setStudents(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch students", "error");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, refresh]);

  const handleEdit = (student) => {
    setSelectedStudent(student);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this student?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      await API.delete(`/students/${id}`);
      Swal.fire("Deleted!", "Student removed", "success");
      fetchStudents();
    }
  };

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between mb-3">
        <input className="form-control w-25" placeholder="Search..." />

        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#studentModal"
        >
          Add New Member
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>

              <td>
                {s.marks?.length
                  ? s.marks.map((m, i) => <div key={i}>{m.subject}</div>)
                  : "-"}
              </td>

              <td>
                {s.marks?.length
                  ? s.marks.map((m, i) => <div key={i}>{m.marks}</div>)
                  : "-"}
              </td>

              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-light"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="mx-2">Page {page}</span>

        <button
          className="btn btn-light"
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      <EditStudentModal
        student={selectedStudent}
        refresh={fetchStudents}
      />
    </div>
  );
}

export default StudentTable;