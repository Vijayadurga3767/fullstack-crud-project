import React, { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/students/")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8000/api/students/${editingId}/`
      : "http://localhost:8000/api/students/";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editingId) {
          setStudents((prev) =>
            prev.map((student) =>
              student.id === editingId ? data : student
            )
          );
        } else {
          setStudents([...students, data]);
        }

        setFormData({ name: "", email: "", course: "" });
        setEditingId(null);
      });
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    setEditingId(student.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`http://localhost:8000/api/students/${id}/`, {
        method: "DELETE",
      })
        .then(() => {
          setStudents((prev) => prev.filter((student) => student.id !== id));
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  return (
    <div>
      <h1>Student List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </form>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <strong>{student.name}</strong> — {student.email} ({student.course})
              &nbsp;
              <button onClick={() => handleEdit(student)}>Edit</button>
              &nbsp;
              <button onClick={() => handleDelete(student.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;