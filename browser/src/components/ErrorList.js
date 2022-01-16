function ErrorList({ errors }) {
  return (
   errors.length > 0 ? <div className="notification is-danger">
      <ul>
        {errors.map((error,i) => {
          return <li key={`error-${i}`}>
            <label htmlFor={error.path && error.path.length > 0 ? error.path[0] : ""}>{error.message}</label>
          </li>}
        )}
      </ul>
    </div> : null 
  )
}

export default ErrorList;