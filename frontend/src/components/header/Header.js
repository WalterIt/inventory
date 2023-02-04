export default function Header() {
  return (
    <div className="--pad header">
      <div className="--flex-between">
        <h3>
          <span className="--fw-thin">Welcome, </span>
          <span className="--color-danger">Walter</span>
        </h3>
        <button className="--btn --btn-danger">Logout</button>
      </div>
      <hr />
    </div>
  );
}
