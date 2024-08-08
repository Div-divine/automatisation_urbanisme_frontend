const SearchBar = ({ nameHandler, idHandler, placeholderHandler, valueHandler, setValueHandler, classNameHandler, refHandler }) => {
    return <form >
        <input type="search"
            name={nameHandler}
            id={idHandler}
            placeholder={placeholderHandler}
            value={valueHandler}
            onChange={setValueHandler}
            className={classNameHandler}
            ref={refHandler}
        />
    </form>
}

export default SearchBar;