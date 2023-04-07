import React from "react";

const FormLayout = ({
  title,
  footer,
  header_style,
  onHide,
  handleSubmit,
  children,
}) => {
  return (
    <div>
      {/* Main content */}
      <section className="content">
        {/* Default box */}
        <div className={`card ${header_style}`}>
          <div className="card-header">
            <h3 className="card-title">{title}</h3>
            <div className="card-tools">
              <button className="btn btn-tool" onClick={onHide} title="Remove">
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {children}
              {footer}
            </form>
          </div>
          {/* /.card-body */}
        </div>
        {/* /.card */}
      </section>
      {/* /.content */}
    </div>
  );
};

export default FormLayout;
