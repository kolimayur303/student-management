import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { useState } from "react";
import StudentModal from "./components/StudentModal";
import StudentTable from "./components/StudentTable";

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(!refresh); // toggle to refresh data
  };

  return (
    <>
      <StudentTable refresh={refresh} />
      <StudentModal fetchStudents={triggerRefresh} />
    </>
  );
}

export default App;