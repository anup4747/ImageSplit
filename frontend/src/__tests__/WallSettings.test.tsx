import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WallSettings from '@/components/WallSettings';

describe('WallSettings', () => {
  const mockOnDimensionsChange = jest.fn();
  const defaultProps = {
    wallDimensions: { width: 200, height: 150, unit: 'cm' as const },
    onDimensionsChange: mockOnDimensionsChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the wall settings panel', () => {
    render(<WallSettings {...defaultProps} />);
    expect(screen.getByText(/Wall Dimensions/i)).toBeInTheDocument();
  });

  it('displays width and height inputs', () => {
    render(<WallSettings {...defaultProps} />);
    const widthInput = screen.getByLabelText(/Wall width/i);
    const heightInput = screen.getByLabelText(/Wall height/i);
    expect(widthInput).toHaveValue(200);
    expect(heightInput).toHaveValue(150);
  });

  it('updates width value on input change', async () => {
    const user = userEvent.setup();
    render(<WallSettings {...defaultProps} />);
    const widthInput = screen.getByLabelText(/Wall width/i) as HTMLInputElement;

    await user.clear(widthInput);
    await user.type(widthInput, '250');

    expect(widthInput.value).toBe('250');
  });

  it('calls onDimensionsChange when Apply button is clicked', async () => {
    const user = userEvent.setup();
    render(<WallSettings {...defaultProps} />);

    const widthInput = screen.getByLabelText(/Wall width/i) as HTMLInputElement;
    await user.clear(widthInput);
    await user.type(widthInput, '250');

    const applyButton = screen.getByLabelText(/Apply wall dimension changes/i);
    await user.click(applyButton);

    await waitFor(() => {
      expect(mockOnDimensionsChange).toHaveBeenCalled();
    });
  });

  it('disables Apply button when no changes made', () => {
    render(<WallSettings {...defaultProps} />);
    const applyButton = screen.getByLabelText(/Apply wall dimension changes/i);
    expect(applyButton).toBeDisabled();
  });

  it('switches unit from cm to m', async () => {
    const user = userEvent.setup();
    render(<WallSettings {...defaultProps} />);

    const mButton = screen.getByRole('button', { name: 'm' });
    await user.click(mButton);

    const widthInput = screen.getByLabelText(/Wall width/i) as HTMLInputElement;
    // 200 cm = 2 m
    expect(parseFloat(widthInput.value)).toBeCloseTo(2, 1);
  });

  it('has proper ARIA attributes', () => {
    render(<WallSettings {...defaultProps} />);
    const widthInput = screen.getByLabelText(/Wall width/i);
    const applyButton = screen.getByLabelText(/Apply wall dimension changes/i);

    expect(widthInput).toHaveAttribute('aria-label');
    expect(applyButton).toHaveAttribute('aria-label');
    expect(applyButton).toHaveAttribute('aria-disabled');
  });
});
