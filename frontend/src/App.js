import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { useState } from "react";
import StudentModal from "./components/StudentModal";
import StudentTable from "./components/StudentTable";

function App() {
  const [refresh, setRefresh] = useState(false);

  // ✅ Better toggle (safe version)
  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <div className="container mt-4">
        <h3 className="mb-3">Student Management</h3>

        {/* Table */}
        <StudentTable refresh={refresh} />

        {/* Modal */}
        <StudentModal fetchStudents={triggerRefresh} />
      </div>
    </>
  );
}

export default App;