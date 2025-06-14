"use client"

import { z } from "@/lib/pt-zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createUserSchema } from "@/actions/users/dtos/create-user.input"
import { EUserRole, EUserStatus, IUserView } from "@/models/user"
import { PasswordInput } from "../ui/password-input"
import { useEffect, useRef, useState } from "react"
import { useAdmin } from "@/hooks/use-admin"
import { Switch } from "../ui/switch"
import Image from "next/image"
import { generateUserName } from "@/lib/utils"
import { CameraIcon } from "lucide-react"
import { images } from "@/lib/images"
import { Checkbox } from "../ui/checkbox"

interface Props {
  forRole: EUserRole
  user?: IUserView
  onSuccess?: () => void
  onError?: () => void
}

export default function UserForm({ onSuccess, onError, forRole, user }: Props) {
  const formSchema = createUserSchema(user ? "update" : "create")
  const { createUser, updateUser } = useAdmin()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      password: undefined,
      userName: user?.userName,
      status: user?.status || EUserStatus.ACTIVE,
      role: user?.role || forRole
    }
  })

  const photoRef = useRef<HTMLInputElement>(null)
  const [enableDelete, setEnableDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user) return
    const generatedUserName = generateUserName(form.getValues().name)
    form.setValue("userName", generatedUserName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch().name])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const profileImage = selectedFile?.name
    const imageContentType = selectedFile?.type

    try {
      if (user) {
        const response = await updateUser({
          id: user.id,
          userName: user.userName,
          data: {
            name: values.name,
            password: values.password,
            role: values.role,
            status: values.status,
            profileImage,
            imageContentType
          }
        })

        if (response.data) {
          // Upload the photo to the google firebase server using the signed URL
          if (response.data.imageSignedUrl) {
            await fetch(response.data.imageSignedUrl, {
              method: "PUT",
              body: selectedFile,
              headers: {
                "Content-Type": selectedFile?.type || "image/jpeg",
              }
            })
          }

          toast.success("Usuário atualizado com sucesso")
          if (onSuccess) onSuccess()
        }

        if (response.error) {
          toast.error("Erro ao atualizar usuário")
          if (onError) onError()
        }

      } else {
        // Create a new user
        const response = await createUser({
          ...values,
          profileImage,
          imageContentType
        })

        if (response.data) {
          // Upload the photo to the google firebase server using the signed URL
          if (response.data.imageSignedUrl) {
            await fetch(response.data.imageSignedUrl, {
              method: "PUT",
              body: selectedFile,
              headers: {
                "Content-Type": selectedFile?.type || "image/jpeg",
              }
            })
          }
          // if (response.data?.profileImageSignedUrl) {
          //   await axios.put(response.data?.profileImageSignedUrl, selectedFile, {
          //     headers: {
          //       "Content-Type": selectedFile?.type || "image/jpeg",
          //     }
          //   })
          // }
          toast.success("Registrado com sucesso")
          if (onSuccess) onSuccess()
        }

        if (response.error) {
          if (response.error.includes("Usuário já existe no sistema")) {
            form.setError("userName", {
              type: "manual",
              message: "Usuário já existe no sistema"
            })
          }

          toast.error("Erro ao registrar usuário")
          if (onError) onError()
        }
      }

    } catch (err) {
      const error = err as Error

      if (error.message.includes("Usuário já existe no sistema")) {
        form.setError("userName", {
          type: "manual",
          message: "Usuário já existe no sistema"
        })
      }

      console.error(error)
      toast.error(error.message)
      if (onError) onError()
    }
  }

  async function handlePhotoInput(file: File) {
    setSelectedFile(file)
  }

  async function handleDelete() {
    setIsDeleting(true)
    if (!user) return

    const response = await updateUser({
      id: user.id,
      userName: user.userName,
      data: {
        delete: true
      }
    })
    setIsDeleting(false)
    if (response.data) {
      toast.success("Usuário excluído com sucesso")
      if (onSuccess) onSuccess()
    } else {
      toast.error("Erro ao excluir usuário")
      if (onError) onError()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full pt-6 flex flex-col gap-4">
        {forRole === EUserRole.ATTENDANT && !!user && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Ativo</FormLabel>
                  <FormDescription>
                    Deixando o atendente como ativo, irá exibi-lo na tela do totem
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === EUserStatus.ACTIVE}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? EUserStatus.ACTIVE : EUserStatus.INACTIVE)
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {forRole === EUserRole.ATTENDANT && (
          <div className="w-full h-48 pt-4 flex items-center justify-center">
            <input
              autoFocus={false}
              id="file"
              name="file"
              type="file"
              className="hidden"
              accept="image/*"
              capture="environment"
              ref={photoRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handlePhotoInput(file)
                }
              }}
            />
            {selectedFile && (
              <Image
                width={192}
                height={192}
                src={URL.createObjectURL(selectedFile)}
                alt="Foto capturada"
                className="size-48 object-cover rounded-lg aspect-square"
                onClick={() => photoRef.current?.click()}
              />
            )}
            {!selectedFile && !user?.profileImage && (
              <Button
                autoFocus={false}
                type="button"
                variant="outline"
                className="w-full size-48"
                onClick={() => photoRef.current?.click()}
              >
                <CameraIcon className="size-24 stroke-[1.5px]" />
              </Button>
            )}
            {!selectedFile && !!user?.profileImage && (
              <div className="relative">
                <Image
                  width={192}
                  height={192}
                  src={user.profileImage || images.userPlaceholder}
                  alt="Foto capturada"
                  className="size-48 object-cover rounded-lg aspect-square"
                />
                <Button
                  autoFocus={false}
                  type="button"
                  variant="default"
                  className="absolute top-2 right-2 rounded-full size-8"
                  onClick={() => photoRef.current?.click()}
                >
                  <CameraIcon className="stroke-[1.5px]" />
                </Button>
              </div>
            )}
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="pt-4">
              <FormLabel>{forRole === EUserRole.TOTEM ? "Descrição" : "Nome Completo"}</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder={forRole === EUserRole.TOTEM ? "Digite uma descrição" : "Digite o nome completo"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Usuário</FormLabel>
              <FormDescription>Após cadastrado, este nome não poderá ser alterado</FormDescription>
              <FormControl>
                <Input
                  disabled={!!user}
                  placeholder="Digite um nome de usuário"
                  {...field}
                  value={field.value as string | undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {forRole === EUserRole.ATTENDANT && !!user && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Administrador</FormLabel>
                  <FormDescription>
                    Deixando o atendente como administrador permite que ele tenha acesso a algumas funcionalidades do sistema
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === EUserRole.ATTENDANT_MANAGER}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? EUserRole.ATTENDANT_MANAGER : EUserRole.ATTENDANT)
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha {user && <i>(opcional)</i>}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={user ? "Digite uma nova senha para alterar" : "Digite a senha para o novo usuário"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {user && (
          <div className="flex items-center gap-2">
            <Checkbox
              className="dark:border-destructive dark:data-[state=checked]:bg-destructive dark:data-[state=checked]:text-destructive-foreground size-8 border-2"
              checked={enableDelete}
              onCheckedChange={() => setEnableDelete(!enableDelete)}
            />
            <Button
              onClick={() => handleDelete()}
              disabled={!enableDelete}
              isLoading={isDeleting}
              type="button"
              variant="destructive"
              className="w-full flex-1"
            >Excluir</Button>
          </div>
        )}
        <Button
          isLoading={form.formState.isSubmitting}
          type="submit"
          size="lg"
          className="w-full"
        >Salvar</Button>
      </form>
    </Form>
  )
}
