import React from 'react'
import diagram from "../assets/img1.png";
import Outputfield from "./Outputfield";
import DotLine from "./Dotline";

function Results({ form, calc }) {
  return (
    <div className="bg-gray-200 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-2 text-center tracking-wide pt-2">Results</h2>
          <div className="grid grid-cols-2 text-sm bg-gray-200 text-black rounded shadow overflow-hidden relative z-0">

            {/* Calculated Design Pressures */}
            <div className="col-span-2">
              <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white">
                <div className=" text-md text-center font-bold text-md tracking-wide text-black py-2 border-b border-black">
                  Calculated Design Pressures
                </div>

                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J53}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K53}</span> 
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J54}
                      </th>
                      <td className="px-4 py-3 text-center  bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K54}</span> 
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Calculated Design Pressures */}

            {/* Deck Pan Design Capacities (with watermark) */}
              <div className="col-span-2 relative mt-4">
                <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0">
                  <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                    Deck Pan Design Capacities
                  </div>

                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J115}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K115}</span>
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J116}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K116}</span>
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J117}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K117}</span>
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J119}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K119}</span>
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J120}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K120}</span> 
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J121}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K121}</span> 
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J122}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K122}</span>
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J123}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K123}</span> 
                        </td>
                      </tr>

                      <tr className="border-b border-black last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J124}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K124}</span> 
                        </td>
                      </tr>

                      <tr className="last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                          {calc?.J125}
                        </th>
                        <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                          <span className="tabular-nums font-semibold">{calc?.K125}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            {/* End Deck Pan Design Capacities */}        
          </div>
          {/* --- Image1 + overlay (desktop/tablet) --- */}
          <div className="mt-4 relative isolate w-full max-w-4xl mx-auto hidden sm:block overflow-visible mb-4">
            <img
              src={diagram}
              alt="Canopy layout"
              className="w-full h-auto relative z-0" // add border here to see image positioning
            />

            {/* ======= LEADER LINES (siblings, relative to image container) ======= */}
            {/* Hanger Arm line */}
            <DotLine
              className="z-0"
              x="27%"      // % of the image width (adjust)
              y="12%"      // % of the image height (adjust)
              angle={40}  // aim toward the card (adjust)
              length="18%" // % of container width (adjust)
            />

            {/* Perimeter Beam line */}
            <DotLine
              className="z-0"
              x="15%"      // adjust to the beam feature on the diagram
              y="50%"
              angle={35}
              length="12%"
            />

            {/* Strut Beam line */}
            <DotLine
              className="z-0"
              x="27%"      // adjust to the strut feature on the diagram
              y="30%"
              angle={50}
              length="21%"
            />
            {/* ======= END LEADER LINES ======= */}

            {/* Canopy Projection */}
            <div
              className="absolute pointer-events-auto overflow-visible z-[2000]"
              style={{
                top: "72%",
                right: "26%",
                width: 50,              // control width
                height: 20,             // control height
                transform: "rotate(-42deg)", // control rotation
                transformOrigin: "left center",
              }}
            >
              <input
                type="text"
                readOnly
                className="w-full h-full p-2 border border-gray-300 rounded bg-gray-200"
                value={form.canopy_total_x_width_projection}
              />
              <span className="pointer-events-none absolute right-4 top-2.5 -translate-y-1/2 text-black">
                ft
              </span>
            </div>

            {/* Spacing Between value */}
            <div
              className="absolute pointer-events-auto overflow-visible z-[2000]"
              style={{
                top: "72.5%",
                right: "56%",
                width: 50,
                height: 20,
                transform: "rotate(10deg)",
                transformOrigin: "left center",
              }}
            >
              <input
                type="text"
                readOnly
                className="w-full h-full p-2 border border-gray-300 rounded bg-gray-200"
                value={form.spacing_between_hanger_arms_or_struts}
              />
              <span className="pointer-events-none absolute right-3 top-2.5 left-8 -translate-y-1/2 text-black">
                ft
              </span>
            </div>

            {/* Canopy total Length */}
            <div
              className="absolute pointer-events-auto overflow-visible z-[2000]"
              style={{
                top: "78%",
                right: "56%",
                width: 50,
                height: 20,
                transform: "rotate(10deg)",
                transformOrigin: "left center",
              }}
            >
              <input
                type="text"
                readOnly
                className="w-full h-full p-2 border border-gray-300 rounded bg-gray-200"
                value={form.canopy_total_y_length}
              />
              <span className="pointer-events-none absolute right-3 top-2.5 left-8 -translate-y-1/2 text-black">
                ft
              </span>
            </div>

            {/* Hanger arm results (card only; line is now a sibling above) */}
            <div
              className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
              style={{ top: "5%", left: "2%", width: 220, overflow: "visible" }}
            >
              <Outputfield
                className="relative z-10"
                componentHeading="Hanger Arm Results"
                componentName={form.hanger_arm_item_name}
                designText={calc?.K244}
                deflectionText={calc?.K249}
              />
            </div>
            {/* End Hanger arm results */}

            {/* Perimeter beam results (card only) */}
            <div
              className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
              style={{ top: "40%", left: "2%", width: 220, overflow: "visible" }}
            >
              <Outputfield
                className="relative z-10"
                componentHeading="Perimeter Beam Results"
                componentName={form.beam_item_name}
                designText={calc?.K178}
                deflectionText={calc?.K179}
              />
            </div>

            {/* Strut beam results (card only) */}
            <div
              className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
              style={{ top: "22%", left: "2%", width: 220, overflow: "visible" }}
            >
              <Outputfield
                className="relative z-10"
                componentHeading="Strut Beam Results"
                componentName={form.strut_beam_item_name}
                designText={calc?.K197}
                deflectionText={calc?.K198}
              />
            </div>

            {/*Host reactions Top connection*/}
            <div
              className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
              style={{ top: "2%", right: "2%", width: 220, overflow: "visible" }}
            >
              <div
                className={`border border-black bg-white p-1 text-sm leading-tight flex flex-col items-center`}
              >
                <div className="font-bold tracking-wide">Top Connection</div>
                <table className='mt-2 w-full border-t border-black'> 
                  <tbody>
                    <tr className="">
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Shear</th>
                      <td className="text-center bg-gray-200 p-1">{calc?.K289}</td>
                    </tr>
                    <tr className="">
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Tension</th>
                      <td className="text-center bg-gray-200 p-1">{calc?.K290}</td>
                    </tr>
                    <tr className="">
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Compression</th>
                      <td className="text-center bg-gray-200  p-1">{calc?.K291}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Moment</th>
                      <td className="text-center bg-gray-200 p-1">{calc?.K292}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Host reactions Top connection */}

            {/*Host reactions Bottom connection*/}
            <div
              className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
              style={{ top: "25%", right: "2%", width: 220, overflow: "visible" }}
            >
              <div
                className={`border border-black bg-white p-1 text-sm leading-tight flex flex-col items-center`}
              >
                <div className="font-bold tracking-wide">Bottom Connection</div>
                <table className='mt-2 w-full border-t border-black'> 
                  <tbody>
                    <tr className="">
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Shear</th>
                      <td className="text-center bg-gray-200 p-1">{calc?.K296}</td>
                    </tr>
                    <tr className="">
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Tension</th>
                      <td className="text-center bg-gray-200 p-1">{calc?.K297}</td>
                    </tr>
                    <tr className="">
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Compression</th>
                      <td className="text-center bg-gray-200  p-1">{calc?.K298}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="text-center font-semibold text-black p-1">Design Moment</th>
                      <td className="text-center bg-gray-200 p-1">{calc?.K299}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Host reactions Bottom connection */}

          </div>
          {/* --- End Image1 + overlay (desktop/tablet) --- */}

          {/* --- Mobile fallback for Image1 (show tables instead of overlay) --- */}
          <div className="sm:hidden space-y-4">

            {/* Hanger Arm Results */}
            <div className="mt-4 rounded-md shadow-sm border border-black overflow-hidden bg-white">
              <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                Hanger Arm Results {form.hanger_arm_item_name ? `– ${form.hanger_arm_item_name}` : ''}
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">Design Capacity</th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                      <span className="tabular-nums font-semibold">57</span><span className="ml-0.5 text-gray-600">%</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">Deflection Capacity</th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                      <span className="tabular-nums font-semibold">90</span><span className="ml-0.5 text-gray-600">%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Perimeter Beam Results */}
            <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white">
              <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                Perimeter Beam Results {form.beam_item_name ? `– ${form.beam_item_name}` : ''}
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">Design Capacity</th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                      <span className="tabular-nums font-semibold">57</span><span className="ml-0.5 text-gray-600">%</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">Deflection Capacity</th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                      <span className="tabular-nums font-semibold">90</span><span className="ml-0.5 text-gray-600">%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Strut Beam Results */}
            <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white">
              <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                Strut Beam Results {form.strut_beam_item_name ? `– ${form.strut_beam_item_name}` : ''}
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">Design Capacity</th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                      <span className="tabular-nums font-semibold">57</span><span className="ml-0.5 text-gray-600">%</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">Deflection Capacity</th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                      <span className="tabular-nums font-semibold">90</span><span className="ml-0.5 text-gray-600">%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/**Top Connection */}
            <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white">
              <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                Top Connection
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Shear
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K289 ?? "--"}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Tension
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K290 ?? "--"}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Compression
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K291 ?? "--"}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Moment
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K292 ?? "--"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/**End : Top Connection */}

            {/**Bottom Connection */}
            <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white">
              <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                Bottom Connection
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Shear
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K296 ?? "--"}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Tension
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K297 ?? "--"}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Compression
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K298 ?? "--"}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                      Design Moment
                    </th>
                    <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">{calc?.K299 ?? "--"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/**End: Bottom connection */}

          </div>
          {/* --- End Mobile fallback for Image1 --- */}

          <div className="grid grid-cols-2 text-sm bg-gray-200 text-black rounded shadow overflow-hidden relative z-0">
            {/* Rafter louver Design Capacities Section */}
            <div className="col-span-2">
              <div className="mt-4 rounded-md shadow-sm border border-black overflow-hidden bg-white">
                <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                  {form.roofElementValue} Design Capacities
                </div>

                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J128} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K128}</span>
                      </td>
                    </tr>

                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J129}  
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K129}</span>
                      </td>
                    </tr>

                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J130}   
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K130}</span>
                      </td>
                    </tr>

                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {form.roofElementValue} {calc?.J131}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K131}</span>
                      </td>
                    </tr>

                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J133}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K133}</span> 
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            {/* End Rafter louver Design Capacities Section with Watermark */}

            {/* Perimeter Beam Design Capacities */}
            {/* Design Fb checks */}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Design Fb Checks
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J168}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K168}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Design Fb checks */}

            {/* Perimeter Beam Design Capacities */}
            <div className="col-span-2 mt-4">
              <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0">
                <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                  Perimeter Beam Design Capacity
                </div>
                <table className="w-full">
                  <tbody>
                    <tr className='border-b border-black'>
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                       {calc?.J172} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K172}</span>
                      </td>
                    </tr>

                    <tr className='border-b border-black'>
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J173}  
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K173}</span> 
                      </td>
                    </tr>

                    <tr className='border-b border-black'>
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J174} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K174}</span>
                      </td>
                    </tr>

                    <tr className='border-black'>
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J175}   
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K175}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Perimeter Beam Design Capacities */}

            {/* Max Design Capacity - 177 */}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Max Design Capacity
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-b border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J178} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K178}</span>
                      </td>
                    </tr>

                    <tr className='border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J179} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K179}</span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            {/* End Max Design Capacity */}

            {/*Design Fb checks for Strut Beam*/}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Design Fb Checks strut
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J184}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K184}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Design Fb checks for Strut Beam */}

            {/*Strut design Capacities */}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Strut Beam Design Capacities
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-b border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J187}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K187}</span>
                      </td>
                    </tr>

                    <tr className='border-b border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J188}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K188}</span> 
                      </td>
                    </tr>

                    <tr className='border-b border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J189} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K189}</span> 
                      </td>
                    </tr>

                    <tr className='border-b border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J190} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K190}</span> 
                      </td>
                    </tr>

                    <tr className='border-b border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J191}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K191}</span>
                      </td>
                    </tr>

                    <tr className='border-b border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J192}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K192}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J193}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K193}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J194}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K194}</span>
                      </td>
                    </tr>

                    <tr className='border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J195}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K195}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Strut design Capacities */}

            {/* Maximum Moment in Strut */}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Maximum Moment in Strut
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J197}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K197}</span> 
                      </td>
                    </tr>

                    <tr className='border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J198} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K198}</span> 
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End : Maximum Moment in Strut */}

            {/* Strut Design – Strut to Anchor Plate/Ledger Beam Weld */}
            <div className="col-span-2 relative mt-4">
              <div className="rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0">
                <div className="text-md text-center font-bold tracking-wide text-black py-2 border-b border-black">
                  Strut Design – Strut to {(form?.BAC || '').toLowerCase().includes('ledger') ? 'Ledger' : 'Anchor'} Beam Weld
                </div>

                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J201}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K201}</span>
                      </td>
                    </tr>

                    <tr className="border-b border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J202}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K202}</span>
                      </td>
                    </tr>

                    <tr className="border-black">
                      <th scope="row" className="px-4 py-3 text-center font-semibold text-gray-900">
                        {calc?.J206}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K206}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End Strut Design – Strut to Anchor Plate/Ledger Beam Weld */}

            {/*Hanger Arm results */}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Hanger arm results
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                       {calc?.J216}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K216}</span> 
                      </td>
                    </tr>
                    
                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J217}  
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K217}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J219}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K219}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J220} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K220}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J222} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K222}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J223}  
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K223}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J224}  
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K224}</span> 
                      </td>
                    </tr>

                    <tr className='border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J225} 
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K225}</span> 
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/*End : Hanger Arm results */}

            {/* Hanger Arm Member Check (Axial Compression/Tension Only) */}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Hanger Arm Member Check
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J243}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K243}</span>
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J244}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K244}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J248}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K248}</span> 
                      </td>
                    </tr>

                    <tr className='border-black'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J249}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K249}</span> 
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            {/*End: Hanger Arm Member Check */}

            {/*Tab Full-perimeter, continous fillet weld*/}
            <div className='col-span-2 mt-4'>
              <div className='rounded-md shadow-sm border border-black overflow-hidden bg-white relative z-0'>
                <div className='text-md text-center font-bold tracking-wide text-black py-2 border-b border-black'>
                  Tab Full-perimeter, continous fillet weld
                </div>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J270}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K270}</span>
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J271}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K271}</span> 
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J276}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K276}</span>
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J277}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K277}</span>
                      </td>
                    </tr>

                    <tr className='border-black border-b'>
                      <th scope="row" className='px-4 py-3 text-center font-semibold text-gray-900'>
                        {calc?.J279}
                      </th>
                      <td className="px-4 py-3 text-center bg-gray-200 border-l border-black">
                        <span className="tabular-nums font-semibold">{calc?.K279}</span> 
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            {/*End : Tab Full-perimeter, continous fillet weld*/ }

          </div>
      </div>
    </div>
  )
}

export default Results