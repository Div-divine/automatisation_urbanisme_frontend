const SearchBar = ({ nameHandler, idHandler, placeholderHandler, valueHandler, setValueHandler, classNameHandler }) => {
    return <form >
        <input type="search"
            name={nameHandler}
            id={idHandler}
            placeholder={placeholderHandler}
            value={valueHandler}
            onChange={setValueHandler}
            className={classNameHandler}
        />
    </form>
}

export default SearchBar;