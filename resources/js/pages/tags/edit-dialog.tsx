import InputError from '@/components/common/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Edit, LoaderCircle } from 'lucide-react';

type TagForm = {
  id: number;
  name: string;
}

export function EditDialog({id, name}: TagForm) {

  const { data, setData, patch, processing, errors } = useForm<Required<TagForm>>({
    id: id,
    name: name
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route("tags.update", { id: id }));
  }

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 cursor-pointer  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent has-[>svg]:px-3"
      >
        <span className="sr-only">Editar</span>
        <Edit className="h-4 w-4 text-muted-foreground" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar etiqueta</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nombre
          </Label>
          <Input
            id="name"
            value={data.name} // Use the passed state
            onChange={(e) => setData('name', e.target.value)}
            className="col-span-3"
          />
          <InputError message={errors.name} />
        </div>
        </form>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit} disabled={processing} className='cursor-pointer'>
        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}
