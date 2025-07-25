    import React, { useState, useEffect } from 'react';
    import '../styles/form.css';

    interface FormData {
        pop: number;
        inf: number;
        betta: number;
        gamma: number;
        step: number;
        end: number;
        city: string,
    }

    interface FormProps {
        onSubmit: (data: FormData) => void;
    }

    const cities = await(await fetch('http://domi.pp.ua:65000/api/population')).json() ;

    export const FormComponent: React.FC<FormProps> = ({ onSubmit }) => {
        const [formData, setFormData] = useState<FormData>({
            pop: 0,
            inf: 0,
            betta: 0,
            gamma: 0,
            step: 0,
            end: 0,
            city: "Україна"
        });   
          

        ////// TEST CONST DATA //////
        const viruses = [
            {name: 'Власний'}
        ]
        ////// TEST CONST DATA //////

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData({
              ...formData,
              [name]: parseFloat(value),
            });
        };
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit(formData);
        };

        ////// Популяція /////
        const [populationDropDown, setPopulationDropDown] = useState(false);
        const [expandedCities, setExpandedCities] = useState<{ [key: string]: boolean }>({});

        const handleSelectPopulation = (value: number) => {
            setFormData({
              ...formData,
              pop: value
            });
            setPopulationDropDown(false);
        };

        const handleFocusPopulation = () => {
            setPopulationDropDown(true);
        };

        const toggleCity = (city: string) => {
            setExpandedCities((prev) => {
                const newState: { [key: string]: boolean } = {};
                Object.keys(prev).forEach((key) => {
                    newState[key] = false;
                });
                newState[city] = !prev[city];
                formData.city = newState[city] ?  city : "Київська"
                return newState;
            });
        };
        ////// Популяція /////

        ///// Вибір вірусу /////
        useEffect(() => {
            const virusSelect = document.getElementById('virusSelect');
            
            if (virusSelect) {
              viruses.forEach(virus => {
                const option = document.createElement('option');
                option.value = virus.name;
                option.textContent = virus.name;
                virusSelect.appendChild(option);
              });
            }
        }, []);

        const handleChangeVirus = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const inpt = document.getElementById('betta');
        };
        ///// Вибір вірусу /////
        


        return (
            <form className="form-container" onSubmit={handleSubmit}>
                <label onBlur={(e) => {if (!e.currentTarget.contains(e.relatedTarget)) {setPopulationDropDown(false);}}} tabIndex={-1}>
                    Населення:
                    <input type="number" min="0" name="pop" value={formData.pop} onChange={handleChange} onFocus={handleFocusPopulation} required />
                    {populationDropDown && (<ul>
                        {cities.cities.map((group) => (
                            <div key={group.city} style={{ padding: '0.4rem 0.7rem' }}>
                                <div onClick={() => toggleCity(group.city)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold' }} >
                                    <span>{group.city}:</span>
                                    <span>{expandedCities[group.city] ? '−' : '+'}</span>
                                </div>
                                {expandedCities[group.city] && (
                                    <div>
                                        {group.population.map((yearData) => (
                                            <li key={yearData.year} tabIndex={0} onClick={() => handleSelectPopulation(yearData.population)} style={{ display: 'flex', justifyContent: 'space-between'}}>
                                                <span>{yearData.year} рік</span> - {' '}
                                                <span>{yearData.population}</span>
                                            </li>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </ul>)}
                </label>

                <label>
                    Вірус:
                    <select name="virus" id="virusSelect" onChange={handleChangeVirus}/>
                </label>

                <label>
                    Початково заражені (% від населення):
                    <input type="number" step='0.00001' min='0' name="inf" onChange={handleChange} required />
                </label>
                <label>
                    betta:
                    <input type="number" step='0.00001' min='0' name="betta" onChange={handleChange} required />
                </label>
                <label>
                    gamma:
                    <input type="number" step='0.00001' min='0' name="gamma" onChange={handleChange} required />
                </label>
                <label>
                    Крок:
                    <input type="number" min='0' name="step" onChange={handleChange} required />
                </label>
                <label>
                    Кінцевий час:
                    <input type="number" min='0' name="end" onChange={handleChange} required />
                </label>

                <button type="submit">Показати графік</button>
            </form>
        );
    };
