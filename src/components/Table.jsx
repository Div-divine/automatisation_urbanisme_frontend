import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { TbCalendarEvent } from "react-icons/tb";
import { TbSearch, TbArrowsLeftRight, TbReload } from "react-icons/tb";
import getAllDataFromCollection from '../api/getAllCollectionData.js';
import SearchBar from './SearchBar';

export default function Table() {
    const [data, setData] = useState(null);
    const dateInputRef = useRef(null)
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        async function getData() {
            const data = await getAllDataFromCollection();
            console.log('All data from collection: ', data)
            setData(data);
            return data;
        }

        getData()
    }, [])

    // Click handler to open the date input
    const handleClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.click();
        }
    };

     // Function to handle changes in the search input field
     const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };


    // Function to filter result by (Référence or Demandeur or Adresse)
        const filteredData = data ? data.filter(item => {
            const Reference = item?.REFERENCE?.toLowerCase().includes(searchQuery.toLowerCase());
            const Demandeur = item?.dos_dnm_t?.toLowerCase().includes(searchQuery.toLowerCase());
            const Addresse = item?.BIE_ADRESSE?.toLowerCase().includes(searchQuery.toLowerCase());
            return Reference || Demandeur || Addresse;
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
                        />
                    </div>
                    <div className='border rounded-xl border-black h-fit p-2 max-lg:hidden'>
                        <TbSearch className='text-xl' />
                    </div>
                </div>
                <div className='h-fit flex flex-wrap justify-between mt-8 lg:mt-0 col'>
                    <div className='flex flex-wrap justify-between border-b border-b-black w-[80%] md:text-sm'>
                        <p className='font-montserrat text-black/50 text-xs '>Filtrer par date</p>
                        <div className='flex flex-wrap justify-end'>
                            <input type="date" name="filter-bar" id="filter-bar" placeholder='Filtrer par date' className='hidden' ref={dateInputRef} />
                            <TbCalendarEvent className='text-2xl' />
                        </div>
                    </div>
                    <div className='border rounded-xl border-black  lg:col-span-1 h-fit p-2 md:text-sm max-lg:hidden'>
                        <TbReload className='text-xl' />
                    </div>
                </div>
                <div className='h-fit border border-black rounded-lg flex flex-wrap justify-between text-center items-center max-lg:mt-8 text-balance md:text-sm p-2'>
                    <TbArrowsLeftRight className='text-xl' />
                    <p className='font-montserrat text-xs'>Afficher les automatisations d'urbanisme</p>
                </div>

            </div>
            <div className='shadow-custom-dark flex flex-col justify-center mt-8 max-h-[650px] overflow-hidden'>
                <div className="overflow-auto max-h-[650px]">
                    <table>
                        <thead className="table-header-styles">
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
                                        <td className='table-cell-styles text-balance w-80 pr-8'>{item.dos_dnm_t}</td>
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
    )
}
