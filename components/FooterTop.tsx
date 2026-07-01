import { Clock, Mail, MapPin, Phone } from "lucide-react";
interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "mashrakh Bihar, India",
    icon :(
      <MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+91 9798405381",
    icon :(
      <Phone className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Email Us",
    subtitle: "skylerop9999@gmail.com",
    icon :(
      <Mail className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "Mon - sun: 9AM - 10PM",
    icon :(
      <Clock className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  }
]


const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data?.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center gap-3 p-4  group transition-colors hover:bg-gray-40 hoverEffect"
        >
          {item?.icon}
          <div>
            <h3 className="font-semibold text-gray-900">{item?.title}</h3>
            <p className="text-gray-600 text-sm  mt-1 group-hover:text-gray-900 hoverEffect">{item?.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  )
};

export default FooterTop