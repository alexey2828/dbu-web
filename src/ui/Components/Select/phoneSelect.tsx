import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Controller, Control } from 'react-hook-form';
import countries from 'i18n-iso-countries';
import ruLocale from 'i18n-iso-countries/langs/ru.json';
import ukLocale from 'i18n-iso-countries/langs/uk.json';

interface IPhoneSelect {
    name: string;
    control: Control<any>;
    rules?: any;
    error?: string;
    defaultValue?: string; // 👈 добавили
}

const PhoneSelect: React.FC<IPhoneSelect> = ({
                                                 name,
                                                 control,
                                                 rules,
                                                 error,
                                                 defaultValue
                                             }) => {

    countries.registerLocale(ruLocale);
    countries.registerLocale(ukLocale);

    let currentLanguage = localStorage.getItem('language');
    const lang: 'en' | 'uk' = currentLanguage === 'ua' ? 'uk' : 'en';

    const generateLocalization = (lang: 'en' | 'uk') => {
        const names = countries.getNames(lang, { select: 'official' });
        const result: Record<string, string> = {};

        Object.entries(names).forEach(([code, name]) => {
            result[code.toLowerCase()] = name;
        });

        return result;
    };

    const localization = generateLocalization(lang);

    return (
        <div>
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue || '380'} // 👈 используем проп
                render={({ field }) => (
                    <PhoneInput
                        country={'ua'}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        enableSearch={true}
                        localization={localization}
                        inputStyle={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '6px',
                            border: error ? '1px solid red' : '1px solid #ccc'
                        }}
                        buttonStyle={{
                            border: error ? '1px solid red' : '1px solid #ccc'
                        }}
                        containerStyle={{ width: '100%' }}
                    />
                )}
            />

            {error && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default PhoneSelect;