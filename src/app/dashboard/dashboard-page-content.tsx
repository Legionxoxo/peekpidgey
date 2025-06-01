"use client"

import LoadingSpinner from "@/components/loading-spinner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { client } from "@/lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { ArrowRight, BarChart2, Clock, Database, DatabaseIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import DashboardEmptyState from "./dashboard-empty-state"
import EventPicture from "@/components/ui/event-picture"
import { Label } from "@/components/ui/label"


const EVENT_PICTURES = [
    { src: "/peekingpidgey/logo-bulbasaur.png", label: "logo1" },
    { src: "/peekingpidgey/logo-nidoran.png", label: "logo2" },
    { src: "/peekingpidgey/logo-pichu.png", label: "logo3" },
    { src: "/peekingpidgey/logo-poliwal.png", label: "logo4" },
    { src: "/peekingpidgey/logo-puff.png", label: "logo5" },
]
export const DashboardPageContent = () => {
    const [pictureModal, setPictureModal] = useState(false)
    const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
    const [deletingCategory, setDeleteCategory] = useState<string | null>(null)
    const queryClient = useQueryClient()

    /* fetching data */
    const { data: categories, isPending: isEventCategoriesLoading } = useQuery({ /* like get */
        queryKey: ['user-event-categories'],
        queryFn: async () => {
            const res = await client.category.getEventCategories.$get()
            const { categories } = await res.json()
            console.log(categories)
            return categories
        }
    })
    /* delete category */
    const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation({ /* like post request */
        mutationFn: async (name: string) => {
            await client.category.deleteCategory.$post({ name })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-event-categories'] })
            setDeleteCategory(null)
        }
    })


    if (isEventCategoriesLoading) {
        return <div className="flex items-center justify-center flex-1 h-full w-full">
            <LoadingSpinner />
        </div>
    }
    if (!categories || categories.length === 0) {
        return <DashboardEmptyState />
    }
    return (
        <><ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
                <li
                    key={category.id}
                    className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
                >
                    <div className="absolute z-0 inset-px rounded-lg bg-white" />

                    <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5" />

                    <div className="relative p-6 z-10">
                        <div className="flex items-center gap-4 mb-6 ">
                            <div
                                onClick={() => setPictureModal(!pictureModal)}
                                className="size-12 rounded-full cursor-pointer flex flex-col items-center justify-center"
                                style={{
                                    backgroundColor: category.color
                                        ? `#${category.color.toString(16).padStart(6, "0")}`
                                        : "#f3f4f6",
                                }}
                            >
                                {/* Display the selected picture above the color circle */}
                                {selectedPicture && (
                                    <img
                                        src={selectedPicture}
                                        alt="Selected Event"
                                        className="w-12 h-12 object-cover rounded-full mb-2" // Margin to space it from the color circle
                                    />
                                )}
                                {/* Color circle */}
                                <div
                                    className={`w-12 h-12 rounded-full ${!selectedPicture ? "bg-gray-300" : ""}`}
                                    style={{
                                        backgroundColor: selectedPicture
                                            ? "transparent" // Make the color circle transparent if an image is selected
                                            : category.color
                                                ? `#${category.color.toString(16).padStart(6, "0")}`
                                                : "#f3f4f6",
                                    }}
                                />
                            </div>


                            <div>
                                <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                                    {category.emoji || "📂"} {category.name}
                                </h3>
                                <p className="text-sm/6 text-gray-600">
                                    {format(category.createdAt, "MMM d, yyyy")}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm/5 text-gray-600">
                                <Clock className="size-4 mr-2 text-brand-500" />
                                <span className="font-medium">Last ping:</span>
                                <span className="ml-1">
                                    {category.lastPing
                                        ? formatDistanceToNow(category.lastPing) + " ago"
                                        : "Never"}
                                </span>
                            </div>
                            <div className="flex items-center text-sm/5 text-gray-600">
                                <Database className="size-4 mr-2 text-brand-500" />
                                <span className="font-medium">Unique fields:</span>
                                <span className="ml-1">{category.uniqueFieldCount || 0}</span>
                            </div>
                            <div className="flex items-center text-sm/5 text-gray-600">
                                <BarChart2 className="size-4 mr-2 text-brand-500" />
                                <span className="font-medium">Events this month:</span>
                                <span className="ml-1">{category.eventCount || 0}</span>
                            </div>
                        </div>
                        {/* buttons */}
                        <div className="flex items-center justify-between mt-4">
                            <Link href={`/dashboard/category/${category.name}`} className={buttonVariants({
                                variant: 'outline', size: 'sm',
                                className: 'flex items-center gap-2 text-sm'
                            })}>View all <ArrowRight className="size-4" />
                            </Link>

                            <Button
                                variant='ghost'
                                size='sm'
                                className="text-gray-500 hover:text-red-600 transition-color"
                                aria-label={`Delete ${category.name} category`}
                                onClick={() => setDeleteCategory(category.name)}
                            >
                                <Trash2 className="size-5" />
                            </Button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>

            {/* confirm modal */}
            <Modal showModal={!!deletingCategory} setShowModal={() => setDeleteCategory(null)} className="max-w-md p-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
                            Delete Category
                        </h2>
                        <p className="text-sm/6 text-gray-600">
                            Are you sure you want to delete the category &quot;{deletingCategory}&quot;?
                            This action cannot be undone</p>
                    </div>
                    <div className="flex justify-end space-x-3 border-t">
                        <Button variant='outline' onClick={() => setDeleteCategory(null)}>Cancel</Button>
                        <Button variant='destructive' onClick={() => deletingCategory && deleteCategory(deletingCategory)} disabled={isDeletingCategory}>
                            {isDeletingCategory ? "Deleting..." : 'Delete'}
                        </Button>

                    </div>
                </div>

            </Modal>

            {/* picture modal */}
            <Modal showModal={pictureModal} setShowModal={() => setPictureModal(false)} className="max-w-md p-8 z-10">
                <div className="space-y-6">

                    <div>
                        <Label>Select Event Picture</Label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {EVENT_PICTURES.map(({ src, label }, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`size-10 flex items-center justify-center text-xl transition-all rounded-md ${selectedPicture === src ? "bg-brand-100 ring-2 ring-brand-700 scale-110" : "bg-brand-100 hover:bg-brand-200"
                                        }`}
                                    onClick={() => setSelectedPicture(src)}
                                >
                                    <img src={src} alt={label} className="w-8 h-8 object-cover rounded-full" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 border-t">
                        <Button variant="outline" onClick={() => setPictureModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => setSelectedPicture(selectedPicture)}>
                            Done
                        </Button>
                    </div>
                </div>
            </Modal>
        </>

    )
}