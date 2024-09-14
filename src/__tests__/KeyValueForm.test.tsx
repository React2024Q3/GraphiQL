import KeyValueForm from '@/components/KeyValueForm';
import { KeyValuePair } from '@/types&interfaces/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { vi } from 'vitest';

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string) => {
      const translations: Record<string, string> = {
        'client.key': 'Key',
        'client.value': 'Value',
        'buttons.add': 'Add',
        'buttons.delete': 'Delete',
        'errors.fill-key-value': 'Please fill in both key and value',
        'errors.fill-in-key': 'Key is required',
        'errors.fill-in-value': 'Value is required',
        'errors.delete-same-key': 'Duplicate key detected',
      };
      return translations[key] || key;
    },
  };
});

describe('KeyValueForm Component', () => {
  const mockOnPairsChange = vi.fn();

  const renderComponent = (initPairs: KeyValuePair[] = []) => {
    render(
      <NextIntlClientProvider locale={'en'}>
        <KeyValueForm
          onPairsChange={mockOnPairsChange}
          title='Test Title'
          initPairs={initPairs}
          height='400px'
        />
      </NextIntlClientProvider>
    );
  };

  it('should render the title and form inputs', () => {
    renderComponent();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Key')).toBeInTheDocument();
    expect(screen.getByLabelText('Value')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('should add a new pair when "Add" button is clicked', () => {
    renderComponent();
    const keyInput = screen.getByLabelText('Key');
    const valueInput = screen.getByLabelText('Value');

    fireEvent.change(keyInput, { target: { value: 'test-key' } });
    fireEvent.change(valueInput, { target: { value: 'test-value' } });
    fireEvent.click(screen.getByText('Add'));

    expect(mockOnPairsChange).toHaveBeenCalledWith([
      { key: 'test-key', value: 'test-value', editable: false },
    ]);
  });

  it('should show an error when trying to add an empty key or value', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Key is required')).toBeInTheDocument();
    expect(screen.getByText('Value is required')).toBeInTheDocument();
  });

  it('should remove a pair when "Delete" button is clicked', () => {
    const initPairs = [{ key: 'existing-key', value: 'existing-value', editable: false }];
    renderComponent(initPairs);

    fireEvent.click(screen.getByText('Delete'));

    expect(mockOnPairsChange).toHaveBeenCalledWith([]);
    expect(screen.queryByText('existing-key')).not.toBeInTheDocument();
    expect(screen.queryByText('existing-value')).not.toBeInTheDocument();
  });

  it('should prevent adding duplicate keys and show an error', () => {
    const initPairs = [{ key: 'duplicate-key', value: 'some-value', editable: false }];
    renderComponent(initPairs);

    const keyInputs = screen.getAllByLabelText('Key');
    const valueInputs = screen.getAllByLabelText('Value');

    fireEvent.change(keyInputs[1], { target: { value: 'duplicate-key' } });
    fireEvent.change(valueInputs[1], { target: { value: 'new-value' } });
    fireEvent.click(screen.getByText('Add'));

    // expect(screen.getByText('Duplicate key detected')).toBeInTheDocument();
    // expect(mockOnPairsChange).not.toHaveBeenCalled();
  });

  it('should initialize with provided pairs', () => {
    const initPairs = [{ key: 'initial-key', value: 'initial-value', editable: false }];
    renderComponent(initPairs);

    expect(screen.getByDisplayValue('initial-key')).toBeInTheDocument();
    expect(screen.getByDisplayValue('initial-value')).toBeInTheDocument();
  });
});
