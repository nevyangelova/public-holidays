import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import CalendarApp from './CalendarApp';
import userEvent from '@testing-library/user-event';

describe('CalendarApp', () => {
    test('fetches holidays when form is submitted with year', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: () => Promise.resolve({holidays: []}),
        } as any);

        render(<CalendarApp />);

        // Select country
        const selectEl = screen.getByLabelText('Country');
        expect(selectEl).toBeInTheDocument();
        userEvent.click(selectEl);

        const optionsPopupEl = await screen.findByRole('listbox', {
            name: 'Country',
        });

        userEvent.click(within(optionsPopupEl).getByText('Vietnam'));

        // Select year
        const datePickerEl = screen.getByLabelText('Year');
        fireEvent.change(datePickerEl, {target: {value: '2022'}});

        // Click "Fetch Holidays" button
        act(() => {
            fireEvent.click(
                screen.getByRole('button', {name: 'Fetch Holidays'})
            );
        });

        await waitFor(() => {
            // Verify that the holidays are displayed
            expect(
                screen.getByText('Public Holidays for 2022 in Vietnam:')
            ).toBeInTheDocument();
        });

        jest.restoreAllMocks();
    });

    test('fetches holidays when form is submitted with year and month', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: () => Promise.resolve({holidays: []}),
        } as any);

        render(<CalendarApp />);

        // Select country
        const selectEl = screen.getByLabelText('Country');
        expect(selectEl).toBeInTheDocument();
        userEvent.click(selectEl);

        const optionsPopupEl = await screen.findByRole('listbox', {
            name: 'Country',
        });

        userEvent.click(within(optionsPopupEl).getByText('Vietnam'));

        // Select year
        const datePickerEl = screen.getByLabelText('Year');
        fireEvent.change(datePickerEl, {target: {value: '2022'}});

        // Select month
        const monthPickerEl = screen.getByLabelText('Month (optional)');
        fireEvent.change(monthPickerEl, {target: {value: 'March'}});

        // Click "Fetch Holidays" button
        act(() => {
            fireEvent.click(
                screen.getByRole('button', {name: 'Fetch Holidays'})
            );
        });
        await waitFor(() => {
            // Verify that the holidays are displayed
            expect(
                screen.getByText('Public Holidays for March 2022 in Vietnam:')
            ).toBeInTheDocument();
        });

        jest.restoreAllMocks();
    });
});
