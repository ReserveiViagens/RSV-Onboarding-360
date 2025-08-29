import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  FileText,
  Save,
  X
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

// Schema de validação
const bookingSchema = z.object({
  customerName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  destination: z.string().min(2, 'Destino deve ter pelo menos 2 caracteres'),
  checkIn: z.string().min(1, 'Data de check-in é obrigatória'),
  checkOut: z.string().min(1, 'Data de check-out é obrigatória'),
  guests: z.number().min(1, 'Deve ter pelo menos 1 hóspede').max(20, 'Máximo de 20 hóspedes'),
  totalPrice: z.number().min(0, 'Preço deve ser maior que zero'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookingFormData) => void;
  booking?: Partial<BookingFormData>;
  mode: 'create' | 'edit';
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  booking,
  mode,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      destination: '',
      checkIn: format(new Date(), 'yyyy-MM-dd'),
      checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      guests: 1,
      totalPrice: 0,
      status: 'pending',
      notes: '',
    },
  });

  const watchedCheckIn = watch('checkIn');
  const watchedGuests = watch('guests');

  // Resetar formulário quando modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && booking) {
        reset({
          ...booking,
          checkIn: booking.checkIn || format(new Date(), 'yyyy-MM-dd'),
          checkOut: booking.checkOut || format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        });
      } else {
        reset({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          destination: '',
          checkIn: format(new Date(), 'yyyy-MM-dd'),
          checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
          guests: 1,
          totalPrice: 0,
          status: 'pending',
          notes: '',
        });
      }
    }
  }, [isOpen, mode, booking, reset]);

  // Validar check-out baseado no check-in
  useEffect(() => {
    if (watchedCheckIn) {
      const checkInDate = new Date(watchedCheckIn);
      const currentCheckOut = watch('checkOut');
      
      if (currentCheckOut && new Date(currentCheckOut) <= checkInDate) {
        setValue('checkOut', format(addDays(checkInDate, 1), 'yyyy-MM-dd'));
      }
    }
  }, [watchedCheckIn, setValue, watch]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: SelectOption[] = [
    { value: 'pending', label: 'Pendente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'completed', label: 'Concluído' },
  ];

  const destinationOptions: SelectOption[] = [
    { value: 'Caldas Novas - GO', label: 'Caldas Novas - GO' },
    { value: 'Rio Quente - GO', label: 'Rio Quente - GO' },
    { value: 'Pirenópolis - GO', label: 'Pirenópolis - GO' },
    { value: 'Goiânia - GO', label: 'Goiânia - GO' },
    { value: 'Brasília - DF', label: 'Brasília - DF' },
    { value: 'Outros', label: 'Outros' },
  ];

  const guestOptions: SelectOption[] = Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i === 0 ? 'hóspede' : 'hóspedes'}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nova Reserva' : 'Editar Reserva'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações do Cliente */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            Informações do Cliente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="customerName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nome Completo"
                  placeholder="Digite o nome completo"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.customerName?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="customerEmail"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="cliente@email.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.customerEmail?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="customerPhone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  leftIcon={<Phone className="h-4 w-4" />}
                  error={errors.customerPhone?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Destino"
                  options={destinationOptions}
                  placeholder="Selecione o destino"
                  error={errors.destination?.message}
                  required
                />
              )}
            />
          </div>
        </div>

        {/* Detalhes da Reserva */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            Detalhes da Reserva
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="checkIn"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Check-in"
                  type="date"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  error={errors.checkIn?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="checkOut"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Check-out"
                  type="date"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  error={errors.checkOut?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="guests"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Hóspedes"
                  options={guestOptions}
                  placeholder="Selecione"
                  error={errors.guests?.message}
                  required
                />
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="totalPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Preço Total"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  leftIcon={<DollarSign className="h-4 w-4" />}
                  error={errors.totalPrice?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Status"
                  options={statusOptions}
                  placeholder="Selecione o status"
                  error={errors.status?.message}
                  required
                />
              )}
            />
          </div>
        </div>

        {/* Notas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Observações
          </h3>
          
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                placeholder="Adicione observações sobre a reserva..."
                className={cn(
                  'w-full px-3 py-2 border border-neutral-300 rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                  'placeholder:text-neutral-400 resize-none',
                  errors.notes && 'border-error-500 focus:ring-error-500/20'
                )}
              />
            )}
          />
        </div>

        {/* Resumo da Reserva */}
        {watchedCheckIn && (
          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="font-medium text-neutral-900 mb-3">Resumo da Reserva</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Duração:</span>
                <div className="font-medium">
                  {watchedCheckIn && watch('checkOut') ? (
                    <>
                      {Math.ceil(
                        (new Date(watch('checkOut')).getTime() - new Date(watchedCheckIn).getTime()) /
                        (1000 * 60 * 60 * 24)
                      )}{' '}
                      dias
                    </>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div>
                <span className="text-neutral-500">Hóspedes:</span>
                <div className="font-medium">{watchedGuests}</div>
              </div>
              <div>
                <span className="text-neutral-500">Preço por dia:</span>
                <div className="font-medium">
                  {watch('totalPrice') && watchedCheckIn && watch('checkOut')
                    ? `R$ ${(
                        watch('totalPrice') /
                        Math.ceil(
                          (new Date(watch('checkOut')).getTime() - new Date(watchedCheckIn).getTime()) /
                          (1000 * 60 * 60 * 24)
                        )
                      ).toFixed(2)}`
                    : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-neutral-500">Status:</span>
                <div className="mt-1">
                  <Badge variant={watch('status') === 'confirmed' ? 'success' : 'warning'}>
                    {statusOptions.find(opt => opt.value === watch('status'))?.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="min-w-24"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Salvando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Criar Reserva' : 'Salvar Alterações'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { BookingModal };
