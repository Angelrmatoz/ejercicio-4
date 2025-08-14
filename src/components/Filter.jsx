const Filter = ({ newText, handleTextFilter }) => {
  return (
    <div>
      Filter show with:{" "}
      <input type="text" value={newText} onChange={handleTextFilter} />
    </div>
  );
};

export default Filter;
