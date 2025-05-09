// components/PhotoGallery.js
export default function PhotoGallery() {
    const images = [
        "a1.svg",  // First image (1x1)
        "a2.svg",
        "a3.svg",
        "a4.svg",
        "a5.svg",
        "a6.svg",
    ];

    return (
        <div className="py-10 px-5 container mx-auto">
            <h2 className="text-3xl xl:text-5xl font-bold p-4 text-g4 mb-8 text-center">
                Our Fun Photo Gallery
            </h2>
            <div className="flex flex-col xl:flex-row">


                <div className="grid grid-cols-2 gap-4  p-2 ">
                    {/* First Row */}
                    <div className="">
                        <img
                            src={images[0]}
                            alt="Gallery Image 1"
                            className="w-full h-72 object-cover rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                        />
                    </div>
                    <div className="">
                        <img
                            src={images[1]}
                            alt="Gallery Image 2"
                            className="w-full h-72 object-cover rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                        />
                    </div>
                    <div className="col-span-2">
                        <img
                            src={images[2]}
                            alt="Gallery Image 3"
                            className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4  p-2 ">
                    {/* First Row */}
                    <div className="col-span-2">
                        <img
                            src={images[5]}
                            alt="Gallery Image 3"
                            className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                        />
                    </div>
                    <div className="">
                        <img
                            src={images[4]}
                            alt="Gallery Image 1"
                            className="w-full h-72 object-cover rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                        />
                    </div>
                    <div className="">
                        <img
                            src={images[3]}
                            alt="Gallery Image 2"
                            className="w-full h-72 object-cover rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                        />
                    </div>

                </div>
            </div>

        </div>

    );
}
