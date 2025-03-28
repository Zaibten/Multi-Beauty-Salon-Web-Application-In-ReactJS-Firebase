const ListItem = ({ clientName, service, time }) => {
  return (
    <div
      id="schedule"
      className="text-white row mt-5 pb-2 align-items-center border-bottom "
    >
      <div className="col-6  col-sm-2">
        <span className="fw-bold">{clientName}</span>
      </div>

      <div className="col-0 col-sm-4">
        <span className="me-4">{service}</span>
      </div>
      <div className="col-8  col-sm-4">
        <span>{time}</span>
      </div>
      <div id="clientActions" className="col-4 col-sm-2 px-0">
        <span className="material-icons-outlined bg-success rounded-circle px-2 py-2 me-3">
          call
        </span>
        <span className="material-icons-outlined bg-danger rounded px-2 py-2">
          close
        </span>
      </div>
    </div>
  );
};
export default ListItem;
