import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { TbCalendarEvent } from "react-icons/tb";
import { TbSearch, TbArrowsLeftRight, TbReload } from "react-icons/tb";
import getAllDataFromCollection from '../api/getAllCollectionData.js';
import SearchBar from './SearchBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale'; // Import the French locale

export default function Table() {
    const [data, setData] = useState(null);
    const searchInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [selectedDate, setSelectedDate] = useState(null); // State for selected date
    const [dateForSearch, setDateForSearch] = useState(''); // State for date filter input

    // Empty each search when other hass an input

    useEffect(()=>{
        if(dateForSearch){
            setSearchQuery('')
        }
    },[dateForSearch])

    
    useEffect(()=>{
        if(searchQuery){
            setDateForSearch('')
        }
    },[searchQuery])

    useEffect(() => {
        async function getData() {
            const data = await getAllDataFromCollection();
            console.log('All data from collection: ', data);
            setData(data);
        }

        getData();
    }, []);

    // Handle date selection and format the date
    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = format(date, 'dd/MM/yyyy', { locale: fr });
            console.log("Selected date:", formattedDate);
            setSelectedDate(date);  // Update the state with Date object
            setDateForSearch(formattedDate); // Update the state with formatted date
        } else {
            setSelectedDate(null);
            setDateForSearch('');
        }
    };

    // Function to handle changes in the search input field
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Function to filter results by (Référence or Demandeur or Adresse) and Date
    const filteredData = data ? data.filter(item => {
        // Convert date_depot to a formatted date string for comparison
        const formattedDateDepot = item?.date_depot ? format(parse(item.date_depot, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy', { locale: fr }) : '';

        // Check if the search query matches and if the date matches
        const Reference = item?.REFERENCE?.toLowerCase().includes(searchQuery.toLowerCase());
        const Demandeur = item?.dos_dnm_t?.toLowerCase().includes(searchQuery.toLowerCase());
        const Addresse = item?.BIE_ADRESSE?.toLowerCase().includes(searchQuery.toLowerCase());
        const DateMatch = !dateForSearch || formattedDateDepot === dateForSearch;

        return (Reference || Demandeur || Addresse) && DateMatch;
    }) : [];

    return (
        <div className='mt-10'>
            <div className='h-fit flex flex-col justify-center items-center max-md:w-[90%] max-lg:m-auto lg:w-[65%] lg:grid lg:grid-cols-3 lg:gap-5 lg:flex-wrap lg:justify-between'>
                <div className='h-fit flex flex-wrap justify-between md:text-sm'>
                    <div className='border-b border-b-black w-[80%] '>
                        <SearchBar
                            placeholderHandler='Rechercher'
                            valueHandler={searchQuery}
                            setValueHandler={handleSearchChange}
                            classNameHandler='placeholder:font-montserrat  placeholder:text-xs border-0 focus:outline-none focus:border-none font-montserrat'
                            nameHandler="search-bar"
                            idHandler="search-bar"
                            refHandler={searchInputRef}
                        />
                    </div>
                    <div className='border rounded-xl border-black h-fit p-2 max-lg:hidden'>
                        <TbSearch className='text-xl' />
                    </div>
                </div>
                <div className='h-fit flex flex-wrap justify-between mt-8 lg:mt-0 col'>
                    <div className='flex flex-wrap justify-between border-b border-b-black w-[80%] md:text-sm'>
                        <SearchBar
                            placeholderHandler='Filtrer par date (jj/MM/aaaa)'
                            valueHandler={dateForSearch}
                            setValueHandler={setDateForSearch}
                            classNameHandler='placeholder:font-montserrat  placeholder:text-xs border-0 focus:outline-none focus:border-none font-montserrat'
                            nameHandler="date-search-bar"
                            idHandler="date-search-bar"
                            refHandler={searchInputRef} // Reuse same ref for simplicity
                        />
                        <div className='flex flex-wrap justify-end'>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                customInput={<div><TbCalendarEvent className='text-2xl' /></div>}
                                dateFormat="dd/MM/yyyy"
                                locale={fr}
                                calendarClassName="custom-calendar"
                                className="border-0 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className='border rounded-xl border-black lg:col-span-1 h-fit p-2 md:text-sm max-lg:hidden'>
                        <TbReload className='text-xl' />
                    </div>
                </div>
                <div className='h-fit border border-black rounded-lg flex flex-wrap justify-between text-center items-center max-lg:mt-8 text-balance md:text-sm p-2'>
                    <TbArrowsLeftRight className='text-xl' />
                    <p className='font-montserrat text-xs'>Afficher les automatisations d'urbanisme</p>
                </div>
            </div>
            <div className='shadow-custom-dark flex flex-col justify-center mt-14 max-h-[650px] overflow-hidden'>
                <div className="overflow-auto max-h-[650px]">
                    <table>
                        <thead className="table-header-styles ">
                            <tr>
                                <th className='table-cell-styles'>Référence</th>
                                <th className='table-cell-styles'>Déposé le</th>
                                <th className='table-cell-styles'>Demandeur</th>
                                <th className='table-cell-styles pr-8'>Surface(m²)</th>
                                <th className='table-cell-styles'>Nature des travaux</th>
                                <th className='table-cell-styles'>Adresse du terrain</th>
                                <th className='table-cell-styles'>Ref cadastrales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-[#f2f2f2]' : ''} border border-black/30`}>
                                        <th className='table-cell-styles pr-8'>{item.REFERENCE}</th>
                                        <td className='table-cell-styles pr-8'>{item.date_depot}</td>
                                        <td className='table-cell-styles text-balance w-96 pr-8'>{item.dos_dnm_t}</td>
                                        <td className='table-cell-styles pr-8'>{item.surf_cc}</td>
                                        <td className='table-cell-styles pr-8 '>
                                            <div className='multi-line-ellipsis' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.nature) }} />
                                        </td>
                                        <td className='multi-line-ellipsis table-cell-styles pr-8 uppercase'>{item.BIE_ADRESSE}</td>
                                        <td className='table-cell-styles uppercase text-balance'>{item.BIE_CAD_T}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">Table vide</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
