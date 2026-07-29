export default function ClientForm({ clientData, setClientData }) {
  const handleChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="card">
      <h2 className="section-title">📋 Client Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Client Name *"
          value={clientData.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={clientData.company}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={clientData.email}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={clientData.phone}
          onChange={handleChange}
          className="input-field"
        />
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={clientData.notes}
          onChange={handleChange}
          className="input-field md:col-span-2 min-h-[80px]"
        />
      </div>
    </div>
  );
}