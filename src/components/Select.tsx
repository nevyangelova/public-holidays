import {Select, MenuItem} from '@material-ui/core';
import {InputLabel} from '@mui/material';

interface Props {
    list: {label: string; value: string}[];
    callback: (value: string) => void;
    value: string;
}

const DropdownSelect: React.FC<Props> = ({list, callback, value}) => {
    return (
        <div className='input-container'>
            <InputLabel id='country'>Country</InputLabel>

            <Select
                labelId='country'
                style={{width: '150px'}}
                value={value}
                onChange={(e: React.ChangeEvent<{value: unknown}>) =>
                    callback(e.target.value as string)
                }
            >
                {list?.length > 0 &&
                    list.map(({label, value}) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
            </Select>
        </div>
    );
};

export default DropdownSelect;
