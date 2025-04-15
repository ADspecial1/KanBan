import { useQuery } from "@tanstack/react-query";
import { fetchContacts } from "@/firebase/fetchData";
import { List, Card } from "antd";
import { Text } from "../../components/text";

const Contacts = () => {
  const { data, isLoading } = useQuery(["contacts"], fetchContacts);

  return (
    <Card title="Contacts">
      <List
        dataSource={data || []}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.name}</Text> - {item.email}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Contacts;
